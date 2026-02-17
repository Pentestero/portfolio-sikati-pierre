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
  const { projects: storeProjects } = usePortfolioStore();
  const [filter, setFilter] = useState("all");
  const { t } = useTranslation(); // Initialize useTranslation

  const defaultProjects = [
    {
      id: "1",
      title: "Plateforme E-Learning",
      description:
        "Application web complète pour l'éducation en ligne avec gestion des cours, paiements mobiles et suivi de progression.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      category: "web",
      github_url: "https://github.com/sikati/elearning-platform",
      demo_url: "https://elearning-demo.vercel.app",
      featured: true,
      order_index: 1,
    },
    {
      id: "2",
      title: "App Mobile Santé Plus",
      description:
        "Application mobile pour la prise de rendez-vous médicaux et téléconsultation au Cameroun.",
      technologies: ["React Native", "Firebase", "Redux"],
      category: "mobile",
      github_url: "https://github.com/sikati/sante-plus-app",
      demo_url: "https://expo.dev/@sikati/sante-plus",
      featured: true,
      order_index: 2,
    },
    {
      id: "3",
      title: "Réseau Sécurisé PME",
      description:
        "Architecture réseau complète avec sécurité avancée pour PME camerounaises.",
      technologies: ["Cisco", "Linux", "VPN", "Pare-feu"],
      category: "network",
      github_url: "https://github.com/sikati/pme-network-security",
      demo_url: null,
      featured: false,
      order_index: 3,
    },
    {
      id: "4",
      title: "Security Audit Tool",
      description:
        "Outil d'audit de sécurité automatisé pour applications web avec rapports détaillés.",
      technologies: ["Python", "Burp Suite", "Kali Linux"],
      category: "security",
      github_url: "https://github.com/sikati/security-audit-tool",
      demo_url: null,
      featured: false,
      order_index: 4,
    },
    {
      id: "5",
      title: "ML Predictive Analytics",
      description:
        "Modèle de machine learning pour prédiction des tendances du marché camerounais.",
      technologies: ["Python", "Scikit-learn", "TensorFlow", "Pandas"],
      category: "ml",
      github_url: "https://github.com/sikati/ml-predictive-analytics",
      demo_url: null,
      featured: false,
      order_index: 5,
    },
    {
      id: "6",
      title: "Portfolio Moderne",
      description:
        "Portfolio personnel moderne et responsive avec animations et design attractif.",
      technologies: ["React", "Tailwind", "Framer Motion"],
      category: "web",
      github_url: "https://github.com/sikati/portfolio",
      demo_url: null,
      featured: true,
      order_index: 6,
    },
  ];

  const projects = storeProjects.length > 0 ? storeProjects : defaultProjects;

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
      className="py-24 px-6 bg-[#0f0f0f] relative overflow-hidden"
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
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-[#0066ff]/10 border border-[#0066ff]/30 rounded-full text-[#0066ff] text-sm font-medium mb-4"
          >
            {t("home.monPortfolio")}
          </motion.span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t("navigation.projects")}
          </h2>
          <p className="text-[#a1a1aa] text-lg max-w-2xl mx-auto">
            {t("home.discoverMyProjects")}
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {categories.map(cat => (
            <motion.button // Wrap with motion.button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === cat.id
                  ? "bg-[#0066ff] text-white shadow-lg shadow-[#0066ff]/25"
                  : "bg-[#1a1a1a] text-[#a1a1aa] border border-[#333] hover:border-[#0066ff] hover:text-[#0066ff]"
              }`}
              whileHover={{ scale: 1.05 }} // Add whileHover effect
              whileTap={{ scale: 0.95 }}
            >
              <cat.icon className="w-4 h-4 inline mr-2" />
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" layout>
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project: any, index: number) => {
              const CategoryIcon = getCategoryIcon(project.category || "web");
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <Card className="bg-[#1a1a1a] border-[#333] h-full hover:border-[#0066ff]/50 transition-all duration-300 group hover:shadow-xl hover:shadow-[#0066ff]/10 overflow-hidden">
                    {/* Card Image/Header */}
                    <div className="relative h-40 overflow-hidden">
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy" // Lazy loading for project images
                        />
                      ) : (
                        <div
                          className={`w-full h-full bg-gradient-to-br ${getCategoryColor(project.category)}`}
                        />
                      )}
                      <div className="absolute inset-0 bg-black/20" /> {/* Overlay for text readability */}
                      <div className="absolute top-4 right-4">
                        {project.featured && (
                          <Badge className="bg-white/20 backdrop-blur text-white text-xs">
                            {t("home.featured")}
                          </Badge>
                        )}
                      </div>
                      <div className="absolute top-4 left-4 z-10"> {/* Position category icon and badge */}
                        <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <CategoryIcon className="w-7 h-7 text-white" />
                        </div>
                        <Badge className="bg-white/20 backdrop-blur text-white text-xs capitalize">
                          {project.category}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-5">
                      <CardTitle className="text-lg text-white mb-2 line-clamp-1">
                        {project.title}
                      </CardTitle>
                      <p className="text-[#71717a] text-sm mb-4 line-clamp-2">
                        {decodeHtmlEntities(project.description)}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {(project.technologies || [])
                          .slice(0, 3)
                          .map((tech: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-[#262626] text-[#a1a1aa] text-xs rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        {(project.technologies || []).length > 3 && (
                          <span className="px-2 py-1 bg-[#262626] text-[#0066ff] text-xs rounded">
                            +{(project.technologies || []).length - 3}
                          </span>
                        )}
                      </div>

                      {/* Links */}
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
                              className="w-full border-[#333] text-[#a1a1aa] hover:bg-[#0066ff] hover:text-white hover:border-[#0066ff]"
                            >
                              <Github className="w-3.5 h-3.5 mr-1.5" /> {t("common.code")}
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
                              className="w-full bg-[#0066ff] hover:bg-[#0052cc]"
                            >
                              {t("common.demo")}{" "}
                              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
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
          className="text-center mt-12"
        >
          <Button
            className="bg-[#0066ff] hover:bg-[#0052cc] text-white px-8 py-3"
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {t("home.collaborateOnProject")} <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
