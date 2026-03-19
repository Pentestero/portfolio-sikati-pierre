import { motion } from "framer-motion";
import { usePortfolioStore } from "@/stores/portfolio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Shield, Network, Brain, Server, Globe } from "lucide-react";
import CyberTerminal from "@/components/ui/CyberTerminal";
import { useTranslation } from "react-i18next";

const Skills = () => {
  const { skills: storeSkills, isLoading } = usePortfolioStore();
  const { t } = useTranslation();

  if (!isLoading && storeSkills.length === 0) {
    return null;
  }

  const skills = storeSkills;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Code": return Code;
      case "Shield": return Shield;
      case "Network": return Network;
      case "Brain": return Brain;
      case "Server": return Server;
      default: return Globe;
    }
  };

  const getCategoryColor = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("web") || cat.includes("dev")) return "from-blue-600 to-cyan-500 shadow-blue-500/10 border-blue-500/20";
    if (cat.includes("cyber") || cat.includes("secur")) return "from-red-600 to-orange-500 shadow-red-500/10 border-red-500/20";
    if (cat.includes("réseau") || cat.includes("network")) return "from-emerald-600 to-teal-500 shadow-emerald-500/10 border-emerald-500/20";
    if (cat.includes("ia") || cat.includes("ml") || cat.includes("brain")) return "from-purple-600 to-pink-500 shadow-purple-500/10 border-purple-500/20";
    return "from-slate-600 to-slate-400 shadow-slate-500/10 border-slate-500/20";
  };

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 bg-[#0a0a0a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-500 text-sm font-medium mb-4">
            {t("home.myExpertise")}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            {t("navigation.skills")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((category: any, idx: number) => {
            const Icon = getIcon(category.icon);
            const colorClasses = getCategoryColor(category.category);
            let technologiesToMap = [];
            if (typeof category.technologies === "string") {
              try { technologiesToMap = JSON.parse(category.technologies); } catch (e) {}
            } else if (Array.isArray(category.technologies)) {
              technologiesToMap = category.technologies;
            }

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className={`bg-[#1a1a1a]/50 backdrop-blur-xl border ${colorClasses.split(' ').pop()} h-full transition-all duration-300 group hover:bg-[#1a1a1a]`}>
                  <CardHeader className="pb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses.split(' ').slice(0, 2).join(' ')} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white group-hover:text-white transition-colors">
                      {category.category}
                    </CardTitle>
                    <span className="text-[#71717a] text-xs font-bold uppercase tracking-widest">
                      {category.level}
                    </span>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {technologiesToMap.map((tech: any, tIdx: number) => (
                      <div key={tIdx}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[#a1a1aa] text-sm font-medium">{tech.name}</span>
                          <span className="text-white text-xs font-bold">{tech.level}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${tech.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.5 + tIdx * 0.1 }}
                            className={`h-full bg-gradient-to-r ${colorClasses.split(' ').slice(0, 2).join(' ')}`}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic Skill Visualization - Cyber Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              Security Lab Terminal
            </h3>
            <p className="text-gray-500 text-sm mt-2">Simulation d'audit et outils de diagnostic actifs</p>
          </div>
          <CyberTerminal />
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
