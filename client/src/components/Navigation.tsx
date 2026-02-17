import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { usePortfolioStore } from "@/stores/portfolio"; // Import usePortfolioStore
import { useTranslation } from "react-i18next"; // Import useTranslation

const Navigation = () => {
  const { profile } = usePortfolioStore(); // Get profile from store
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { t, i18n } = useTranslation(); // Initialize useTranslation

  const logoUrl = profile?.avatar_url; // Use avatar_url as logo if available

  const navItems = [
    { id: "hero", label: t("navigation.home") },
    { id: "about", label: t("navigation.about") },
    { id: "skills", label: t("navigation.skills") },
    { id: "projects", label: t("navigation.projects") },
    { id: "contact", label: t("navigation.contact") },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = navItems.map(item => item.id);
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#1a1a1a]"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => scrollToSection("hero")}
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={profile?.full_name || t("common.welcome")} // Translated alt text
                  className="w-10 h-10 rounded-xl object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-[#0066ff] to-[#8b5cf6] rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              )}
              {!logoUrl && ( // Only show text if no logo image is present
                <span
                  className="text-white font-bold text-xl"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {profile?.full_name?.split(' ')[0] || "SIKATI"}
                </span>
              )}
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? "text-[#0066ff] bg-[#0066ff]/10"
                      : "text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1a]"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.button>
              ))}
              {/* Language Switcher */}
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => i18n.changeLanguage('en')}
                  className={`text-sm font-medium ${i18n.language === 'en' ? 'text-white' : 'text-[#a1a1aa] hover:text-white'}`}
                  aria-label="Switch to English"
                >
                  EN
                </button>
                <span className="text-[#71717a]">|</span>
                <button
                  onClick={() => i18n.changeLanguage('fr')}
                  className={`text-sm font-medium ${i18n.language === 'fr' ? 'text-white' : 'text-[#a1a1aa] hover:text-white'}`}
                  aria-label="Switch to French"
                >
                  FR
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-[#1a1a1a] transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden bg-[#0a0a0a]/98 backdrop-blur-xl border-t border-[#1a1a1a]"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-6 py-4 space-y-2">
                {navItems.map(item => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === item.id
                        ? "text-[#0066ff] bg-[#0066ff]/10"
                        : "text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1a]"
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navigation;
