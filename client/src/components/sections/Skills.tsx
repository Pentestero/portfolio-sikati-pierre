import { motion } from "framer-motion";
import { usePortfolioStore } from "@/stores/portfolio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Shield, Network, Brain, Server } from "lucide-react";
import { useTranslation } from "react-i18next";

const Skills = () => {
  const { skills: storeSkills } = usePortfolioStore();
  const { t } = useTranslation();

  const defaultSkills = [
    {
      category: "Développement Web & Mobile",
      icon: "Code",
      level: "Avancé",
      technologies: [
        { name: "React", level: 85 },
        { name: "TypeScript", level: 75 },
        { name: "Node.js", level: 70 },
        { name: "Tailwind CSS", level: 80 },
        { name: "PHP", level: 65 },
      ],
    },
    {
      category: "Administration Réseaux",
      icon: "Network",
      level: "Intermédiaire",
      technologies: [
        { name: "Cisco IOS", level: 55 },
        { name: "Linux", level: 60 },
        { name: "TCP/IP", level: 50 },
        { name: "VPN", level: 45 },
        { name: "Pare-feu", level: 40 },
      ],
    },
    {
      category: "Cybersécurité",
      icon: "Shield",
      level: "Débutant",
      technologies: [
        { name: "Kali Linux", level: 35 },
        { name: "Burp Suite", level: 30 },
        { name: "OWASP", level: 40 },
        { name: "Pentesting", level: 25 },
        { name: "Cryptographie", level: 35 },
      ],
    },
    {
      category: "Machine Learning & IA",
      icon: "Brain",
      level: "Débutant",
      technologies: [
        { name: "Python", level: 55 },
        { name: "Scikit-learn", level: 30 },
        { name: "TensorFlow", level: 25 },
        { name: "Pandas", level: 40 },
        { name: "Jupyter", level: 45 },
      ],
    },
  ];

  const skills = storeSkills.length > 0 ? storeSkills : defaultSkills;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Code":
        return Code;
      case "Shield":
        return Shield;
      case "Network":
        return Network;
      case "Brain":
        return Brain;
      case "Server":
        return Server;
      default:
        return Code;
    }
  };

  const getLevelColor = (level: string) => {
    if (level === "Avancé") return "from-[#0066ff] to-[#003d99]";
    if (level === "Intermédiaire") return "from-[#f59e0b] to-[#d97706]";
    return "from-[#8b5cf6] to-[#7c3aed]";
  };

  return (
    <section
      id="skills"
      className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-[#0f0f0f] relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0066ff]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8b5cf6]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-block px-3 sm:px-4 py-1.5 bg-[#0066ff]/10 border border-[#0066ff]/30 rounded-full text-[#0066ff] text-xs sm:text-sm font-medium mb-3 sm:mb-4"
          >
            {t("home.myExpertise")}
          </motion.span>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t("navigation.skills")}
          </h2>
          <p className="text-[#a1a1aa] text-sm sm:text-lg max-w-2xl mx-auto px-2 sm:px-0">
            {t("home.skillsDescription")}
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:6">
          {skills.map((category: any, index: number) => {
            const Icon = getIcon(category.icon || "Code");
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="bg-[#1a1a1a] border-[#2a2a2a] h-full hover:border-[#0066ff]/50 transition-all duration-300 group hover:shadow-lg hover:shadow-[#0066ff]/10">
                  <CardHeader className="text-center pb-2 sm:pb-3">
                    <motion.div
                      className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 border border-[#333]"
                      whileHover={{ rotate: 5 }}
                    >
                      <Icon className="w-6 sm:w-8 h-6 sm:h-8 text-[#0066ff]" />
                    </motion.div>
                    <CardTitle className="text-sm sm:text-lg text-white">
                      {category.category}
                    </CardTitle>
                    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-1 sm:mt-2">
                      <span
                        className={`w-2 h-2 rounded-full bg-gradient-to-r ${getLevelColor(category.level || "Débutant")}`}
                      />
                      <span className="text-[#a1a1aa] text-xs sm:text-sm">
                        {category.level}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 sm:space-y-3">
                    {(() => {
                      let technologiesToMap = [];
                      if (typeof category.technologies === "string") {
                        try {
                          technologiesToMap = JSON.parse(category.technologies);
                        } catch (e) {
                          console.error(
                            "Failed to parse technologies JSON:",
                            e
                          );
                        }
                      } else if (Array.isArray(category.technologies)) {
                        technologiesToMap = category.technologies;
                      }
                      return technologiesToMap.map(
                        (tech: any, techIndex: number) => (
                          <motion.div
                            key={techIndex}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + techIndex * 0.05 }}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[#a1a1aa] text-xs sm:text-sm font-medium">
                                {tech.name}
                              </span>
                              <span className="text-[#0066ff] text-xs font-semibold">
                                {tech.level}%
                              </span>
                            </div>
                            <div className="w-full bg-[#2a2a2a] rounded-full h-1 sm:h-1.5 overflow-hidden">
                              <motion.div
                                className={`h-full bg-gradient-to-r ${getLevelColor(category.level || "Débutant")}`}
                                initial={{ width: 0 }}
                                whileInView={{ width: `${tech.level}%` }}
                                viewport={{ once: true }}
                                transition={{
                                  duration: 0.8,
                                  delay: 0.5 + techIndex * 0.1,
                                }}
                              />
                            </div>
                          </motion.div>
                        )
                      );
                    })()}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
