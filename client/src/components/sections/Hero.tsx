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
} from "lucide-react";
import { useTranslation } from "react-i18next"; // Import useTranslation

const Hero = () => {
  const { profile, contactInfo } = usePortfolioStore();
  const { t } = useTranslation(); // Initialize useTranslation

  const heroTitle = profile?.full_name || "PIERRE SIKATI MBARGA";
  const heroSubtitle = profile?.bio
    ? profile.bio
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&#39;/g, "'")
    : t("home.subtitle");
  const heroDescription = t("home.heroDescription");
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

  return (
    <section
      id="hero"
      className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 py-20 relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-[#0066ff]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-[#8b5cf6]/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0066ff]/5 rounded-full blur-[150px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="max-w-5xl mx-auto text-center z-10 relative">
        {/* Profile Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            {avatarUrl ? (
              <motion.img
                src={avatarUrl}
                alt={profile?.full_name || t("common.welcome")} // Translated alt text
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-[#0066ff]/30 shadow-2xl shadow-[#0066ff]/20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              />
            ) : (
              <motion.div
                className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-[#0066ff] to-[#8b5cf6] flex items-center justify-center border-4 border-[#0066ff]/30 shadow-2xl shadow-[#0066ff]/20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <User className="w-16 h-16 text-white" />
              </motion.div>
            )}
            <motion.div
              className="absolute bottom-2 right-2 w-5 h-5 bg-[#10b981] rounded-full border-4 border-[#0a0a0a]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-[#0066ff]/10 border border-[#0066ff]/30 rounded-full text-[#0066ff] text-sm font-medium">
            <span className="w-2 h-2 bg-[#0066ff] rounded-full animate-pulse" />
            {t("home.availableForCollaboration")}
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-5 text-white leading-tight break-words"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {heroTitle}
        </motion.h1>

        {/* Subtitle - Hidden, using bio for About section instead */}

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-base text-[#71717a] mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          {heroDescription}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Button
            className="bg-[#0066ff] hover:bg-[#0052cc] text-white px-8 py-3.5 text-base font-semibold rounded-xl shadow-lg shadow-[#0066ff]/25 hover:shadow-[#0066ff]/40 transition-all"
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {heroCtaPrimary}
            <ArrowDown className="ml-2 w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            className="border-2 border-[#333] text-[#a1a1aa] hover:border-[#0066ff] hover:text-[#0066ff] px-8 py-3.5 text-base font-semibold rounded-xl transition-all"
            onClick={() =>
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {heroCtaSecondary}
          </Button>
          {cvUrl && ( // Conditionally render the download CV button
            <Button
              variant="outline"
              className="border-2 border-[#0066ff] text-[#0066ff] hover:bg-[#0066ff] hover:text-white px-8 py-3.5 text-base font-semibold rounded-xl transition-all"
            >
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                {t("home.downloadCV")}
                <Download className="ml-2 w-5 h-5" />
              </a>
            </Button>
          )}
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex gap-4 justify-center items-center"
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
              className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-[#a1a1aa] hover:bg-[#0066ff] hover:border-[#0066ff] hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
              aria-label={item.label}
            >
              <item.icon className="w-5 h-5" />
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#52525b]"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
};

export default Hero;
