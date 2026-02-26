import { motion, AnimatePresence } from "framer-motion";
import { usePortfolioStore } from "@/stores/portfolio";
import { useEffect, useState } from "react";
import {
  Award,
  BookOpen,
  Code,
  Target,
  Speech,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowDown,
  Star,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const About = () => {
  const { profile } = usePortfolioStore();
  const { t, i18n } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const sections = profile?.highlighted_sections || [];

  const getTranslatedText = (value: any, fallback: string): string => {
    if (!value) return fallback;
    
    let text = "";
    
    if (typeof value === "string") {
      text = value;
    } else if (value && typeof value === "object") {
      const currentLang = i18n?.language || "fr";
      text = value[currentLang] || value["fr"] || "";
    }
    
    if (typeof text !== "string" || !text) return fallback;
    
    return text
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&");
  };

  useEffect(() => {
    console.log("Profile in About component:", profile);
  }, [profile]);

  const goToPrev = () => {
    setActiveIndex(prev => (prev === 0 ? sections.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex(prev => (prev === sections.length - 1 ? 0 : prev + 1));
  };

  const bioText = getTranslatedText(profile?.bio, "");
  const paragraphs = bioText 
    ? [bioText] 
    : [t("home.aboutBio1"), t("home.aboutBio2")];

  const visionText = getTranslatedText(profile?.vision_text, t("home.visionText"));

  const dynamicStats = [
    {
      icon: Code,
      label: t("home.projects"),
      value: profile?.projects_count || "15+",
      color: "from-[#0066ff] to-[#003d99]",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: BookOpen,
      label: t("admin.technologiesCount"),
      value: profile?.technologies_count || "20+",
      color: "from-[#8b5cf6] to-[#7c3aed]",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Target,
      label: t("admin.yearsExperience"),
      value: profile?.years_experience || "3+",
      color: "from-[#10b981] to-[#059669]",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: Award,
      label: t("admin.certificationsCount"),
      value: profile?.certifications_count || "2",
      color: "from-[#f59e0b] to-[#d97706]",
      bgColor: "bg-amber-500/10",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, rotateX: -90, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      rotateX: 0,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    }),
    hover: {
      y: -8,
      rotateY: 5,
      transition: { duration: 0.3 },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <section
      id="about"
      className="py-12 sm:py-16 md:py-20 px-3 sm:px-6 bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-[#0066ff]/10 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-48 sm:w-72 h-48 sm:h-72 bg-[#8b5cf6]/10 rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDY2ZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-[#0066ff]/10 border border-[#0066ff]/30 rounded-full text-[#0066ff] text-xs sm:text-sm font-medium mb-3"
          >
            <Star className="w-3 h-3" />
            {t("home.myJourney")}
          </motion.span>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-3 sm:mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t("home.aboutMe")}
          </h2>
          <p className="text-[#64748b] text-sm sm:text-base max-w-xl mx-auto">
            {t("home.discoverMyStory")}
          </p>
        </motion.div>

        {/* Stats Section - 3D Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10"
        >
          {dynamicStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                custom={index}
                variants={cardVariants}
                whileHover="hover"
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#0066ff] to-[#8b5cf6] rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                <motion.div
                  className={`relative ${stat.bgColor} backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/20 shadow-xl`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <motion.div
                      className={`w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                    </motion.div>
                    <motion.span
                      className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                    >
                      {stat.value}
                    </motion.span>
                  </div>
                  <div className="text-[#64748b] text-xs sm:text-sm font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content - Bio + Vision Side by Side */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Bio Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0066ff]/20 to-[#8b5cf6]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0066ff] to-[#8b5cf6] rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#1a1a1a]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  À Propos
                </h3>
              </div>
              <div className="space-y-3">
                {paragraphs.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-[#475569] leading-relaxed text-sm sm:text-base"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#10b981]/20 to-[#06b6d4]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#262626] rounded-2xl p-5 sm:p-6 shadow-xl border border-[#333] overflow-hidden">
              {/* Animated stripe */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#10b981] via-[#06b6d4] to-[#0066ff]"
                animate={{ scaleX: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-br from-[#10b981] to-[#06b6d4] rounded-xl flex items-center justify-center"
                  animate={{ boxShadow: ["0 0 0 0 rgba(16, 185, 129, 0.4)", "0 0 0 8px rgba(16, 185, 129, 0)", "0 0 0 0 rgba(16, 185, 129, 0)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Speech className="w-5 h-5 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t("home.myVision")}
                </h3>
              </div>
              <p className="text-[#a1a1aa] leading-relaxed text-sm sm:text-base">
                {visionText}
              </p>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#10b981]/10 to-transparent rounded-full" />
              <div className="absolute -top-5 -left-5 w-20 h-20 bg-gradient-to-br from-[#06b6d4]/10 to-transparent rounded-full" />
            </div>
          </motion.div>
        </div>

        {/* Highlighted Sections - 3D Carousel */}
        {sections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-8 sm:mt-10"
          >
            {/* Tab Navigation - Pill Style */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-lg border border-slate-200 flex">
                {sections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveIndex(index)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeIndex === index
                        ? "bg-gradient-to-r from-[#0066ff] to-[#8b5cf6] text-white shadow-md"
                        : "text-[#64748b] hover:text-[#1a1a1a]"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {section.id === "myStory" ? "Mon Histoire" : "Mes Motivations"}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <motion.button
                onClick={goToPrev}
                whileHover={{ scale: 1.1, rotate: -10 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-[#64748b] hover:text-[#0066ff] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <div className="flex gap-2">
                {sections.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeIndex === index
                        ? "w-8 bg-gradient-to-r from-[#0066ff] to-[#8b5cf6]"
                        : "w-2 bg-slate-300"
                    }`}
                  />
                ))}
              </div>
              <motion.button
                onClick={goToNext}
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-[#64748b] hover:text-[#0066ff] transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* 3D Card Carousel */}
            <div className="relative perspective-1000">
              <AnimatePresence mode="wait">
                {sections.map(
                  (section, index) =>
                    index === activeIndex && (
                      <motion.div
                        key={section.id}
                        initial={{ opacity: 0, rotateX: -90, scale: 0.9, z: -100 }}
                        animate={{
                          opacity: 1,
                          rotateX: 0,
                          scale: 1,
                          z: 0,
                        }}
                        exit={{ opacity: 0, rotateX: 90, scale: 0.9, z: -100 }}
                        transition={{
                          duration: 0.5,
                          type: "spring",
                          stiffness: 100,
                          damping: 20,
                        }}
                        className="relative"
                      >
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0066ff]/20 to-[#8b5cf6]/20 rounded-3xl blur-2xl" />
                        
                        <motion.div
                          className={`relative bg-white rounded-2xl shadow-2xl border overflow-hidden ${
                            expandedCard === section.id ? "p-6" : "p-5"
                          }`}
                          style={{ transformStyle: "preserve-3d" }}
                          whileHover={{ y: -2 }}
                        >
                          {/* Top gradient */}
                          <div
                            className="h-2 w-full"
                            style={{
                              background:
                                section.id === "myStory"
                                  ? "linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)"
                                  : "linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)",
                            }}
                          />

                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <motion.div
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.5 }}
                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                  section.id === "myStory"
                                    ? "bg-gradient-to-br from-amber-500/20 to-red-500/20"
                                    : "bg-gradient-to-br from-cyan-500/20 to-blue-500/20"
                                }`}
                              >
                                {section.id === "myStory" ? (
                                  <BookOpen className="w-6 h-6 text-amber-500" />
                                ) : (
                                  <Target className="w-6 h-6 text-cyan-500" />
                                )}
                              </motion.div>
                              <div>
                                <h3 className="text-xl font-bold text-[#1a1a1a]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                  {section.id === "myStory" ? t("home.myStory") : t("home.myMotivations")}
                                </h3>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <span className="text-xs text-[#64748b]">
                                    {index + 1} sur {sections.length}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {expandedCard === section.id && (
                              <motion.button
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => setExpandedCard(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                              >
                                <X className="w-4 h-4 text-[#64748b]" />
                              </motion.button>
                            )}
                          </div>

                          <div className={`mt-4 ${expandedCard === section.id ? "max-h-64 overflow-y-auto" : ""}`}>
                            {expandedCard === section.id ? (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-[#475569] leading-relaxed text-sm sm:text-base whitespace-pre-wrap"
                              >
                                {section.content
                                  .replace(/<[^>]*>/g, "")
                                  .replace(/&nbsp;/g, " ")
                                  .replace(/&#39;/g, "'")}
                              </motion.p>
                            ) : (
                              <p className="text-[#475569] leading-relaxed text-sm sm:text-base line-clamp-3">
                                {section.content
                                  .replace(/<[^>]*>/g, "")
                                  .replace(/&nbsp;/g, " ")
                                  .replace(/&#39;/g, "'")
                                  .substring(0, 180)}
                                {section.content.replace(/<[^>]*>/g, "").length > 180 && "..."}
                              </p>
                            )}
                          </div>

                          {expandedCard !== section.id && (
                            <motion.button
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              onClick={() => setExpandedCard(section.id)}
                              className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                section.id === "myStory"
                                  ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                                  : "bg-cyan-50 text-cyan-600 hover:bg-cyan-100"
                              }`}
                            >
                              <span>Lire la suite</span>
                              <ArrowDown className="w-4 h-4" />
                            </motion.button>
                          )}
                        </motion.div>
                      </motion.div>
                    )
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default About;
