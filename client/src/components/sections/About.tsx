import { motion, AnimatePresence } from "framer-motion";
import { usePortfolioStore } from "@/stores/portfolio";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  Award,
  BookOpen,
  Code,
  Target,
  Speech,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  ArrowDown,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const About = () => {
  const { profile } = usePortfolioStore();
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const sections = profile?.highlighted_sections || [];

  useEffect(() => {
    console.log("Profile in About component:", profile);
    console.log(
      "Highlighted Sections in About component:",
      profile?.highlighted_sections
    );
  }, [profile]);

  const goToPrev = () => {
    setActiveIndex(prev => (prev === 0 ? sections.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex(prev => (prev === sections.length - 1 ? 0 : prev + 1));
  };

  const paragraphs = profile?.bio
    ? [
        profile.bio
          .replace(/<[^>]*>/g, "")
          .replace(/&nbsp;/g, " ")
          .replace(/&#39;/g, "'"),
      ]
    : [t("home.aboutBio1"), t("home.aboutBio2")];

  const dynamicStats = [
    {
      icon: Code,
      label: t("home.projects"), // Translated label
      value: profile?.projects_count || "15+",
      color: "from-[#0066ff] to-[#003d99]",
    },
    {
      icon: BookOpen,
      label: t("admin.technologiesCount"), // Translated label
      value: profile?.technologies_count || "20+",
      color: "from-[#8b5cf6] to-[#7c3aed]",
    },
    {
      icon: Target,
      label: t("admin.yearsExperience"), // Translated label
      value: profile?.years_experience || "3+",
      color: "from-[#10b981] to-[#059669]",
    },
    {
      icon: Award,
      label: t("admin.certificationsCount"), // Translated label
      value: profile?.certifications_count || "2",
      color: "from-[#f59e0b] to-[#d97706]",
    },
  ];

  return (
    <section
      id="about"
      className="py-24 px-6 bg-[#fafafa] relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0066ff]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8b5cf6]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-[#0066ff]/10 border border-[#0066ff]/30 rounded-full text-[#0066ff] text-sm font-medium mb-4"
          >
            {t("home.myJourney")}
          </motion.span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t("home.aboutMe")}
          </h2>
          <p className="text-[#64748b] text-lg max-w-2xl mx-auto">
            {t("home.discoverMyStory")}
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg shadow-[#0066ff]/5 border border-[#f1f5f9]">
              {paragraphs.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-[#475569] leading-relaxed text-base mb-4 last:mb-0"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Vision Card - Professional Style */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#333]"
            >
              {/* Top stripe */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#0066ff] to-[#8b5cf6]" />

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#0066ff]/10">
                      <Speech className="w-5 h-5 text-[#0066ff]" />
                    </div>
                    <h3
                      className="text-lg font-semibold text-white"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {t("home.myVision")}
                    </h3>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[#0066ff]"
                        style={{ opacity: 0.3 + i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[#a1a1aa] leading-relaxed">
                  {profile?.vision_text
                    ? profile.vision_text
                        .replace(/<[^>]*>/g, "")
                        .replace(/&nbsp;/g, " ")
                        .replace(/&#39;/g, "'")
                    : t("home.visionText")}
                </p>
              </div>
            </motion.div>

            {/* Highlighted Sections - Tab Navigation */}
            <div className="relative">
              {/* Tab Navigation */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveIndex(index)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      activeIndex === index
                        ? "bg-[#1a1a1a] text-white shadow-lg"
                        : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
                    }`}
                  >
                    {section.id === "myStory" ? (
                      <BookOpen className="w-4 h-4" />
                    ) : (
                      <Target className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {t(`home.${section.id}`)}
                    </span>
                  </button>
                ))}
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={goToPrev}
                  className="w-10 h-10 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center hover:bg-[#333] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  {sections.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeIndex === index
                          ? "bg-[#0066ff] w-6"
                          : "bg-[#d1d5db]"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={goToNext}
                  className="w-10 h-10 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center hover:bg-[#333] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Cards Container */}
              <div
                className={`relative ${expandedCard ? "h-[450px]" : "h-[320px]"} overflow-hidden transition-all duration-500`}
              >
                <AnimatePresence mode="wait">
                  {sections.map(
                    (section, index) =>
                      index === activeIndex && (
                        <motion.div
                          key={section.id}
                          initial={{ opacity: 0, x: 100, rotateY: -10 }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            rotateY: 0,
                            height: "100%",
                          }}
                          exit={{ opacity: 0, x: -100, rotateY: 10 }}
                          transition={{
                            duration: 0.4,
                            type: "spring",
                            stiffness: 150,
                            damping: 20,
                          }}
                          className="absolute inset-0"
                        >
                          {/* Card with shadows */}
                          <div className="absolute inset-0 bg-[#0a0a0a] rounded-2xl translate-x-2 translate-y-2" />
                          <div className="absolute inset-0 bg-[#1a1a1a] rounded-2xl translate-x-1 translate-y-1" />
                          <div className="absolute inset-0 bg-[#262626] rounded-2xl" />

                          {/* Main Card */}
                          <div
                            className={`relative h-full bg-[#1a1a1a] rounded-2xl border overflow-hidden transition-all duration-500 ${
                              expandedCard === section.id
                                ? "border-[#0066ff]"
                                : "border-[#333]"
                            }`}
                          >
                            {/* Top stripe - Different colors for each card */}
                            <div
                              className="h-2 w-full"
                              style={{
                                background:
                                  section.id === "myStory"
                                    ? "linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)"
                                    : "linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)",
                              }}
                            />

                            {/* Decorative elements - Different for each */}
                            {section.id === "myStory" ? (
                              <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-[#f59e0b]/20 to-transparent rounded-full" />
                            ) : (
                              <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-[#06b6d4]/20 to-transparent rounded-full" />
                            )}

                            <div className="relative z-10 p-6 h-full flex flex-col">
                              {/* Header */}
                              <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                  <motion.div
                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                                    style={{
                                      background:
                                        section.id === "myStory"
                                          ? "linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(239, 68, 68, 0.2) 100%)"
                                          : "linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)",
                                    }}
                                  >
                                    {section.id === "myStory" ? (
                                      <BookOpen className="w-7 h-7 text-[#f59e0b]" />
                                    ) : (
                                      <Target className="w-7 h-7 text-[#06b6d4]" />
                                    )}
                                  </motion.div>
                                  <div>
                                    <h3
                                      className="text-2xl font-bold text-white"
                                      style={{
                                        fontFamily: "'Playfair Display', serif",
                                      }}
                                    >
                                      {t(`home.${section.id}`)}
                                    </h3>
                                    <div className="flex items-center gap-1 mt-1">
                                      <Sparkles className="w-3 h-3 text-[#0066ff]" />
                                      <span className="text-xs text-[#64748b]">
                                        {index + 1} sur {sections.length}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Close button when expanded */}
                                {expandedCard === section.id && (
                                  <motion.button
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onClick={() => setExpandedCard(null)}
                                    className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center hover:bg-[#444] transition-colors"
                                  >
                                    <X className="w-4 h-4 text-white" />
                                  </motion.button>
                                )}
                              </div>

                              {/* Content */}
                              <div
                                className={`flex-1 overflow-y-auto ${expandedCard === section.id ? "pr-2" : ""}`}
                              >
                                {expandedCard === section.id ? (
                                  <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-[#a1a1aa] leading-relaxed text-lg whitespace-pre-wrap"
                                  >
                                    {section.content
                                      .replace(/<[^>]*>/g, "")
                                      .replace(/&nbsp;/g, " ")
                                      .replace(/&#39;/g, "'")}
                                  </motion.p>
                                ) : (
                                  <p className="text-[#a1a1aa] leading-relaxed text-lg">
                                    {section.content
                                      .replace(/<[^>]*>/g, "")
                                      .replace(/&nbsp;/g, " ")
                                      .replace(/&#39;/g, "'")
                                      .substring(0, 250)}
                                    {section.content.replace(/<[^>]*>/g, "")
                                      .length > 250 && "..."}
                                  </p>
                                )}
                              </div>

                              {/* Read more button */}
                              {expandedCard !== section.id && (
                                <motion.button
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  onClick={() => setExpandedCard(section.id)}
                                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                  style={{
                                    background:
                                      section.id === "myStory"
                                        ? "linear-gradient(90deg, rgba(245, 158, 11, 0.2) 0%, rgba(239, 68, 68, 0.2) 100%)"
                                        : "linear-gradient(90deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)",
                                    color:
                                      section.id === "myStory"
                                        ? "#f59e0b"
                                        : "#06b6d4",
                                  }}
                                >
                                  <span>Lire la suite</span>
                                  <ArrowDown className="w-4 h-4" />
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Stats - Enhanced */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {dynamicStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 150,
                  damping: 15,
                }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="bg-white border-0 shadow-lg shadow-[#0066ff]/5 hover:shadow-2xl hover:shadow-[#0066ff]/20 transition-all duration-300 group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0066ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                      whileHover={{ scale: 1.05 }}
                    >
                      <stat.icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <div className="text-3xl font-bold text-[#1a1a1a] mb-1">
                      {stat.value}
                    </div>
                    <div className="text-[#64748b] text-sm font-medium">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
