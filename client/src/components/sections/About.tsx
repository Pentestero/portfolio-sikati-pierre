import { motion, useMotionValue, useTransform } from "framer-motion";
import { usePortfolioStore } from "@/stores/portfolio";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import AnimatedNotebook from "@/components/ui/AnimatedNotebook";
import {
  Award,
  BookOpen,
  Code,
  Target,
  Speech,
  Star,
  Cpu,
  Globe,
  Zap,
  History,
  Rocket,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const TechCard = ({ children, className = "", color = "blue" }: { children: React.ReactNode, className?: string, color?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const glowColor = color === "blue" ? "rgba(59, 130, 246, 0.5)" : color === "purple" ? "rgba(168, 85, 247, 0.5)" : "rgba(245, 158, 11, 0.5)";

  return (
    <motion.div
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative group ${className}`}
    >
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${color === "blue" ? "from-blue-500 to-cyan-500" : color === "purple" ? "from-purple-500 to-pink-500" : "from-amber-500 to-orange-500"} rounded-3xl blur opacity-20 group-hover:opacity-100 transition duration-500`}></div>
      <div className="relative h-full bg-[#0f0f0f] rounded-3xl p-6 sm:p-8 border border-white/5 leading-none flex items-center justify-center overflow-hidden">
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform" />
        {children}
      </div>
    </motion.div>
  );
};

const About = () => {
  const { profile, isLoading } = usePortfolioStore();
  const { t, i18n } = useTranslation();

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
    return text.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&#39;/g, "'").replace(/&amp;/g, "&");
  };

  const bioText = getTranslatedText(profile?.bio, "");
  const visionText = getTranslatedText(profile?.vision_text, "");
  const highlightedSections = profile?.highlighted_sections || [];

  const notebookPages = [
    ...(highlightedSections
      .filter(section => getTranslatedText(section.content, ""))
      .map(section => ({
        id: section.id,
        title: section.id === 'myStory' ? t("home.myStory") : t("home.myMotivations"),
        content: getTranslatedText(section.content, ""),
        icon: section.id === 'myStory' ? History : Rocket,
        color: section.id === 'myStory' ? 'text-amber-400' : 'text-purple-400',
        gradient: section.id === 'myStory' ? 'from-amber-500 to-orange-500' : 'from-purple-500 to-pink-500',
      }))),
    ...(visionText ? [{
      id: 'myVision',
      title: t("home.myVision"),
      content: visionText || t("home.visionText"),
      icon: Globe,
      color: 'text-cyan-400',
      gradient: 'from-blue-500 to-cyan-500',
    }] : [])
  ].filter(page => page.content);

  const stats = [
    { label: t("home.projects"), value: profile?.projects_count || "0", icon: Code, color: "text-blue-500" },
    { label: t("admin.technologiesCount"), value: profile?.technologies_count || "0", icon: Cpu, color: "text-purple-500" },
    { label: t("admin.yearsExperience"), value: profile?.years_experience || "0", icon: Zap, color: "text-amber-500" },
    { label: t("admin.certificationsCount"), value: profile?.certifications_count || "0", icon: Award, color: "text-emerald-500" },
  ].filter(s => s.value !== "0" && s.value !== "");

  if (!profile && !isLoading) return null;

  return (
    <section id="about" className="py-24 px-4 sm:px-6 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-purple-600/10 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Star className="w-4 h-4" /> {t("home.myJourney")}
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
            {t("home.aboutMe")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-auto">
          {/* Bio Card */}
          <TechCard className="md:col-span-8" color="blue">
            <div className="relative z-10 w-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Biographie</h3>
              </div>
              <p className="text-gray-400 leading-relaxed text-lg">
                {bioText || t("home.aboutBio1")}
              </p>
            </div>
          </TechCard>

          {/* Stats Bento */}
          <div className="md:col-span-4 grid grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-[#161616] border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center text-center group"
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mb-3 group-hover:animate-pulse`} />
                <span className="text-3xl font-black text-white mb-1 tracking-tighter">
                  <AnimatedNumber value={stat.value} />
                </span>
                <span className="text-gray-500 text-[10px] uppercase font-black tracking-widest">{stat.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Animated Notebook for Story, Motivation, Vision */}
          {notebookPages.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-12"
            >
              <AnimatedNotebook pages={notebookPages} />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
