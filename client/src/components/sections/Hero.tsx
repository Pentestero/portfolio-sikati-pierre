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

  const heroTitle = profile?.full_name || "PIERRE SIKATI MBARGA";
  
  const getHeroDescValue = (): string => {
    try {
      const heroDescValue = profile?.hero_description;
      
      if (!heroDescValue) {
        return t("home.heroDescription");
      }
      
      let text = "";
      
      if (typeof heroDescValue === "string") {
        text = heroDescValue;
      } else if (heroDescValue && typeof heroDescValue === "object") {
        const currentLang = i18n?.language || "fr";
        text = heroDescValue[currentLang] || heroDescValue["fr"] || "";
      }
      
      if (typeof text !== "string" || !text) {
        return t("home.heroDescription");
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
      return t("home.heroDescription");
    }
  };
  
  const heroDescription = getHeroDescValue();
  const heroCtaPrimary = t("home.collaborateOnProject");
  const heroCtaSecondary = t("home.viewMyProjects");

  const githubUrl = contactInfo?.github_url || "https://github.com/sikati";
  const linkedinUrl = contactInfo?.linkedin_url
    ? contactInfo.linkedin_url.startsWith("http://") ||
      contactInfo.linkedin_url.startsWith("https://")
      ? contactInfo.linkedin_url
      : `https://${contactInfo.linkedin_url}`
    : "https://linkedin.com/in/sikati-pierre";
  const email = contactInfo?.email || "sikati.pierre@example.com";
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
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#0066ff]/30 rounded-full"
            initial={{
              x: Math.random() * 1000,
              y: Math.random() * 1000,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
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
                  <motion.img
                    src={avatarUrl}
                    alt={profile?.full_name || t("common.welcome")}
                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-[#0066ff]/30 shadow-2xl mx-auto"
                    style={{
                      boxShadow: "0 20px 40px rgba(0, 102, 255, 0.3)",
                    }}
                  />
                ) : (
                  <motion.div
                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-[#0066ff] to-[#8b5cf6] flex items-center justify-center border-4 border-[#0066ff]/30 shadow-2xl mx-auto"
                    style={{
                      boxShadow: "0 20px 40px rgba(0, 102, 255, 0.3)",
                    }}
                  >
                    <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                  </motion.div>
                )}
              </motion.div>
              
              {/* Online indicator with glow */}
              <motion.div
                className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#10b981] rounded-full border-4 border-[#0a0a0a]" />
                <div className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 bg-[#10b981] rounded-full animate-ping opacity-75" />
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
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-white leading-tight px-2"
          style={{ 
            fontFamily: "'Playfair Display', serif",
            textShadow: "0 4px 20px rgba(0, 102, 255, 0.3)",
          }}
        >
          {heroTitle}
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-xs sm:text-sm md:text-base text-[#71717a] mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed px-3 sm:px-4"
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
              className="bg-gradient-to-r from-[#0066ff] to-[#0052cc] hover:from-[#0052cc] hover:to-[#003d99] text-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold rounded-lg w-full sm:w-auto max-w-[280px]"
              style={{
                boxShadow: "0 10px 30px rgba(0, 102, 255, 0.3)",
              }}
              onClick={() => scrollToSection("contact")}
            >
              {heroCtaPrimary}
              <ArrowDown className="ml-2 w-4 h-4" />
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
        <motion.div
          variants={itemVariants}
          className="flex gap-3 sm:gap-4 justify-center items-center"
        >
          {[
            { icon: Github, href: githubUrl, label: "GitHub" },
            { icon: Linkedin, href: linkedinUrl, label: "LinkedIn" },
            { icon: Mail, href: `mailto:${email}`, label: "Email" },
          ].map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-[#a1a1aa] hover:bg-[#0066ff] hover:border-[#0066ff] hover:text-white transition-all"
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
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.a>
          ))}
        </motion.div>
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
