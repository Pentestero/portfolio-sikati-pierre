import { motion } from "framer-motion";
import { usePortfolioStore } from "@/stores/portfolio";
import { Github, Linkedin, Mail, ArrowUp, User } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { contactInfo, profile } = usePortfolioStore();
  const { t } = useTranslation();

  const githubUrl = contactInfo?.github_url
    ? (contactInfo.github_url.startsWith("http://") || contactInfo.github_url.startsWith("https://")
      ? contactInfo.github_url
      : `https://${contactInfo.github_url}`)
    : "";
  const linkedinUrl = contactInfo?.linkedin_url
    ? (contactInfo.linkedin_url.startsWith("http://") || contactInfo.linkedin_url.startsWith("https://")
      ? contactInfo.linkedin_url
      : `https://${contactInfo.linkedin_url}`)
    : "";
  const email = contactInfo?.email || "";

  const socialLinks = [
    { icon: Github, href: githubUrl, show: !!githubUrl },
    { icon: Linkedin, href: linkedinUrl, show: !!linkedinUrl },
    { icon: Mail, href: email ? `mailto:${email}` : "", show: !!email },
  ].filter(link => link.show);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-[#0a0a0a] border-t border-[#1a1a1a] py-10 sm:py-12 px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-8 mb-8">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center md:text-left"
          >
            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-10 h-10 rounded-xl object-cover border border-white/10 shadow-lg"
                  loading="lazy"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-[#1a1a1a] to-[#262626] rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
                  <User className="w-5 h-5 text-[#0066ff]" />
                </div>
              )}
              <span
                className="text-white font-bold text-lg sm:text-xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {profile?.full_name || ""}
              </span>
            </div>
            <p className="text-[#71717a] text-sm">
              {t("footer.description")}
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <h4 className="text-white font-semibold mb-4">{t("footer.quickLinks")}</h4>
            <div className="space-y-2">
              {[
                { id: "hero", label: t("navigation.home") },
                { id: "about", label: t("navigation.about") },
                { id: "skills", label: t("navigation.skills") },
                { id: "projects", label: t("navigation.projects") },
                { id: "contact", label: t("navigation.contact") },
              ].map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block text-[#71717a] hover:text-[#0066ff] text-sm transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            {socialLinks.length > 0 && (
              <>
                <h4 className="text-white font-semibold mb-4">{t("footer.followMe")}</h4>
                <div className="flex gap-3 justify-center">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      target={link.href.startsWith("mailto") ? undefined : "_blank"}
                      rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                      className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-[#a1a1aa] hover:bg-[#0066ff] hover:text-white transition-all"
                    >
                      <link.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </>
            )}
          </motion.div>

        {/* Bottom */}
        <div className="pt-6 sm:pt-8 border-t border-[#1a1a1a] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#52525b] text-xs sm:text-sm text-center md:text-left">
            © {new Date().getFullYear()} {profile?.full_name || ""}. {t("footer.allRightsReserved")}
          </p>
          <motion.button
            onClick={scrollToTop}
            className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-[#a1a1aa] hover:bg-[#0066ff] hover:text-white transition-all"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
