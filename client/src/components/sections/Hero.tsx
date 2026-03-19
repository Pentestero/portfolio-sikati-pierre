import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePortfolioStore } from "@/stores/portfolio";
import {
  ArrowDown,
  Github,
  Linkedin,
  Mail,
  User,
  Download,
  Star,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

const Hero = () => {
  const { profile, contactInfo } = usePortfolioStore();
  const { t } = useTranslation();

  const heroTitle = profile?.full_name || "";
  
  const getHeroDescValue = (): string => {
    try {
      const heroDescValue = profile?.hero_description;
      
      if (!heroDescValue) {
        return "";
      }
      
      let text = "";
      
      if (typeof heroDescValue === "string") {
        text = heroDescValue;
      } else if (heroDescValue && typeof heroDescValue === "object") {
        const currentLang = i18n?.language || "fr";
        text = heroDescValue[currentLang] || heroDescValue["fr"] || "";
      }
      
      if (typeof text !== "string" || !text) {
        return "";
      }
      
      return text
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
    } catch (error) {
      console.error("Error getting hero description:", error);
      return "";
    }
  };
  
  const heroDescription = getHeroDescValue();
  const heroCtaPrimary = t("home.collaborateOnProject");
  const heroCtaSecondary = t("home.viewMyProjects");

  const githubUrl = contactInfo?.github_url || "";
  const linkedinUrl = contactInfo?.linkedin_url
    ? contactInfo.linkedin_url.startsWith("http://") ||
      contactInfo.linkedin_url.startsWith("https://")
      ? contactInfo.linkedin_url
      : `https://${contactInfo.linkedin_url}`
    : "";
  const email = contactInfo?.email || "";
  const avatarUrl = profile?.avatar_url;
  const cvUrl = profile?.cv_url;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -45 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const floatVariants = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, 2, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  const pulseGlowVariants = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(0, 102, 255, 0.3)",
        "0 0 40px rgba(0, 102, 255, 0.5)",
        "0 0 60px rgba(139, 92, 246, 0.3)",
        "0 0 40px rgba(139, 92, 246, 0.5)",
        "0 0 20px rgba(0, 102, 255, 0.3)",
      ],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <section
      id="hero"
      className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-3 sm:px-4 md:px-6 py-12 sm:py-16 relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 sm:top-20 left-[-100px] sm:left-0 w-64 sm:w-96 h-64 sm:h-96 bg-[#0066ff]/10 rounded-full blur-[60px] sm:blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 sm:bottom-20 right-[-100px] sm:right-0 w-48 sm:w-72 h-48 sm:h-72 bg-[#8b5cf6]/10 rounded-full blur-[50px] sm:blur-[80px]"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-500/20 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              y: [0, -200, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto text-center z-10 relative"
      >
        {/* Profile Photo - 3D Effect */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
          <div className="relative inline-block perspective-1000">
            <motion.div
              variants={pulseGlowVariants}
              animate="animate"
              className="relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
                whileHover={{ rotateY: 15, scale: 1.05 }}
                className="relative"
              >
                {avatarUrl ? (
                  <div className="relative group inline-block">
                    <motion.div
                      className="absolute -inset-3 bg-gradient-to-r from-[#0066ff] to-[#8b5cf6] rounded-3xl blur-xl opacity-10 group-hover:opacity-30 transition-opacity duration-700"
                    />
                    <div className="relative z-10 bg-[#1a1a1a] rounded-3xl p-1 border-2 border-white/10 shadow-2xl overflow-hidden">
                      <motion.img
                        src={avatarUrl}
                        alt={profile?.full_name || t("common.welcome")}
                        className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 object-contain rounded-2xl mx-auto"
                        style={{
                          filter: "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5))",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <motion.div
                    className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-[#262626] flex items-center justify-center border-2 border-white/10 shadow-2xl mx-auto relative z-10"
                  >
                    <User className="w-16 h-16 sm:w-24 sm:h-24 text-[#0066ff]" />
                  </motion.div>
                )}
              </motion.div>
              
              {/* Online indicator with glow */}
              <motion.div
                className="absolute -bottom-2 -right-2 z-20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#10b981] rounded-full border-4 border-[#0a0a0a] shadow-lg shadow-[#10b981]/40" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-6">
          <motion.span
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-[#0066ff]/10 border border-[#0066ff]/30 rounded-full text-[#0066ff] text-xs sm:text-sm font-medium"
            whileHover={{ scale: 1.05 }}
          >
            <motion.span
              className="w-2 h-2 bg-[#0066ff] rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Star className="w-3 h-3" />
            {t("home.availableForCollaboration")}
          </motion.span>
        </motion.div>

        {/* Main Title - 3D Text Effect */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 text-white leading-tight px-2 tracking-tighter"
          style={{ 
            fontFamily: "'Playfair Display', serif",
            textShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          }}
        >
          {heroTitle.split(" ").map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="inline-block mr-3"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg md:text-xl text-blue-100/60 mb-8 max-w-2xl mx-auto leading-relaxed px-3 sm:px-4 font-medium"
        >
          {heroDescription}
        </motion.p>

        {/* CTA Buttons - 3D Cards */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center mb-6 sm:mb-8 px-2"
        >
          <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
            <Button
              className="relative bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-5 py-3 text-[0.7rem] font-black uppercase tracking-wider rounded-xl w-full sm:w-auto max-w-[300px] shadow-lg shadow-blue-600/20 overflow-hidden"
              onClick={() => scrollToSection("contact")}
            >
              {heroCtaPrimary}
              <ArrowDown className="ml-2 w-4 h-4" />
              {/* Pulsating Glow */}
              <motion.span 
                className="absolute inset-0 rounded-xl bg-blue-500 blur-lg opacity-30"
                animate={{ opacity: [0, 0.4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              className="border-2 border-[#333] text-[#a1a1aa] hover:border-[#0066ff] hover:text-[#0066ff] px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold rounded-lg w-full sm:w-auto max-w-[280px] bg-transparent"
              onClick={() => scrollToSection("projects")}
            >
              {heroCtaSecondary}
            </Button>
          </motion.div>
          
          {cvUrl && (
            <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="border-2 border-[#0066ff] text-[#0066ff] hover:bg-[#0066ff] hover:text-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold rounded-lg w-full sm:w-auto max-w-[280px] bg-transparent"
              >
                <a href={cvUrl} target="_blank" rel="noopener noreferrer" download className="flex items-center justify-center">
                  {t("home.downloadCV")}
                  <Download className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Social Links - 3D Icons */}
        {(githubUrl || linkedinUrl || email) && (
          <motion.div
            variants={itemVariants}
            className="flex gap-3 sm:gap-4 justify-center items-center"
          >
            {[
              { icon: Github, href: githubUrl, label: "GitHub", show: !!githubUrl },
              { icon: Linkedin, href: linkedinUrl, label: "LinkedIn", show: !!linkedinUrl },
              { icon: Mail, href: email ? `mailto:${email}` : "", label: "Email", show: !!email },
            ].filter(item => item.show).map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 overflow-hidden"
                initial={{ opacity: 0, y: 20, rotateX: -45 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{
                  scale: 1.15,
                  rotateY: 15,
                  z: 10,
                }}
                whileTap={{ scale: 0.95 }}
                aria-label={item.label}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <item.icon className="w-6 h-6 relative z-10" />
              </motion.a>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#52525b]"
        animate={{
          y: [0, 8, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown className="w-5 h-5" />
      </motion.div>
    </section>
  );
};

export default Hero;
