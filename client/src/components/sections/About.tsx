import { motion } from "framer-motion";
import { usePortfolioStore } from "@/stores/portfolio";
import { Card, CardContent } from "@/components/ui/card";
import { Award, BookOpen, Code, Target, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next"; // Import useTranslation

const About = () => {
  const { profile } = usePortfolioStore();
  const { t } = useTranslation(); // Initialize useTranslation

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

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-[#0066ff] to-[#8b5cf6] rounded-2xl p-8 text-white"
            >
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6" />
                <h3
                  className="text-xl font-bold"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t("home.myVision")}
                </h3>
              </div>
              <p className="text-white/90 leading-relaxed">
                {profile?.vision_text
                  ? profile.vision_text
                      .replace(/<[^>]*>/g, "")
                      .replace(/&nbsp;/g, " ")
                      .replace(/&#39;/g, "'")
                  : t("home.visionText")}
              </p>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {dynamicStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white border-0 shadow-lg shadow-[#0066ff]/5 hover:shadow-xl hover:shadow-[#0066ff]/10 transition-all duration-300 group">
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
