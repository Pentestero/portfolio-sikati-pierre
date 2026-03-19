import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { usePortfolioStore } from "@/stores/portfolio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  ExternalLink,
  Filter,
  Code,
  Smartphone,
  Network,
  Shield,
  Brain,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next"; // Import useTranslation

import { decodeHtmlEntities } from "@/lib/utils"; // Import decodeHtmlEntities

const Projects = () => {
  const { projects: storeProjects, isLoading } = usePortfolioStore();
  const [filter, setFilter] = useState("all");
  const { t } = useTranslation();

  if (!isLoading && storeProjects.length === 0) {
    return null;
  }

  const projects = storeProjects;

  const categories = [
    { id: "all", label: t("home.all"), icon: Filter },
    { id: "web", label: t("home.web"), icon: Code },
    { id: "mobile", label: t("home.mobile"), icon: Smartphone },
    { id: "network", label: t("home.network"), icon: Network },
    { id: "security", label: t("home.security"), icon: Shield },
    { id: "ml", label: t("home.ml"), icon: Brain },
  ];

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p: any) => p.category === filter);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "web":
        return Code;
      case "mobile":
        return Smartphone;
      case "network":
        return Network;
      case "security":
        return Shield;
      case "ml":
        return Brain;
      default:
        return Code;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "web":
        return "from-[#0066ff] to-[#0052cc]";
      case "mobile":
        return "from-[#8b5cf6] to-[#7c3aed]";
      case "network":
        return "from-[#10b981] to-[#059669]";
      case "security":
        return "from-[#ef4444] to-[#dc2626]";
      case "ml":
        return "from-[#f59e0b] to-[#d97706]";
      default:
        return "from-[#0066ff] to-[#0052cc]";
    }
  };

  return (
    <section
      id="projects"
      className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-[#0f0f0f] relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#0066ff]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#8b5cf6]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-3 sm:px-4 py-1.5 bg-[#0066ff]/10 border border-[#0066ff]/30 rounded-full text-[#0066ff] text-xs sm:text-sm font-medium mb-3 sm:mb-4"
          >
            {t("home.monPortfolio")}
          </motion.span>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t("navigation.projects")}
          </h2>
          <p className="text-[#a1a1aa] text-sm sm:text-lg max-w-2xl mx-auto px-2 sm:px-0">
            {t("home.discoverMyProjects")}
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-10"
        >
          {categories.map(cat => (
            <motion.button // Wrap with motion.button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                filter === cat.id
                  ? "bg-[#0066ff] text-white shadow-lg shadow-[#0066ff]/25"
                  : "bg-[#1a1a1a] text-[#a1a1aa] border border-[#333] hover:border-[#0066ff] hover:text-[#0066ff]"
              }`}
              whileHover={{ scale: 1.05 }} // Add whileHover effect
              whileTap={{ scale: 0.95 }}
            >
              <cat.icon className="w-3 h-4 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" layout>
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project: any, index: number) => {
              const CategoryIcon = getCategoryIcon(project.category || "web");
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative group h-full"
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${getCategoryColor(project.category)} rounded-3xl blur opacity-10 group-hover:opacity-100 transition duration-500`}></div>
                  <Card className="relative bg-[#0f0f0f] border-white/5 h-full transition-all duration-300 overflow-hidden rounded-3xl p-0">
                    {/* Card Image/Header */}
                    <div className="relative h-40 overflow-hidden">
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className={`w-full h-full bg-gradient-to-br ${getCategoryColor(project.category)}`}
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                      <div className="absolute top-4 right-4">
                        {project.featured && (
                          <Badge className="bg-blue-500 text-white border-none text-[10px] font-black uppercase">
                            {t("home.featured")}
                          </Badge>
                        )}
                      </div>
                      <div className="absolute top-4 left-4 z-10">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-2 border border-white/10 group-hover:scale-110 transition-transform">
                          <CategoryIcon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <CardTitle className="text-xl font-black text-white mb-2 line-clamp-1 break-words tracking-tight">
                        {project.title}
                      </CardTitle>
                      <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                        {decodeHtmlEntities(project.description)}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {(project.technologies || [])
                          .slice(0, 3)
                          .map((tech: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-white/5 text-gray-400 text-[10px] font-bold rounded-lg border border-white/5 uppercase tracking-widest"
                            >
                              {tech}
                            </span>
                          ))}
                      </div>

                      <div className="flex gap-2">
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full border-white/10 text-gray-400 hover:bg-white/10 hover:text-white rounded-xl text-xs font-black uppercase"
                            >
                              <Github className="w-4 h-4 mr-2" /> {t("common.code")}
                            </Button>
                          </a>
                        )}
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                          >
                            <Button
                              size="sm"
                              className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-blue-600/20"
                            >
                              {t("common.demo")}{" "}
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 sm:mt-10 md:mt-12"
        >
          <Button
            className="bg-[#0066ff] hover:bg-[#0052cc] text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base"
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {t("home.collaborateOnProject")} <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
