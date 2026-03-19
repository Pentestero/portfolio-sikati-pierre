import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { usePortfolioStore } from "@/stores/portfolio"; // Import usePortfolioStore
import { useTranslation } from "react-i18next"; // Import useTranslation

const Navigation = () => {
  const { profile } = usePortfolioStore(); // Get profile from store
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { t, i18n } = useTranslation(); // Initialize useTranslation

  const logoUrl = profile?.avatar_url; // Use avatar_url as logo if available
  const [scrollProgress, setScrollProgress] = useState(0);

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

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

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
      // Simple scroll to element with offset
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Close mobile menu
      setIsOpen(false);
    } else {
      console.warn('Element not found:', sectionId);
    }
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#1a1a1a]"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Scroll Progress Bar */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 transition-all duration-300" style={{ width: `${scrollProgress}%` }} />
        
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
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
                  className="w-10 h-10 rounded-xl object-cover border border-white/10 shadow-lg"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-[#1a1a1a] to-[#262626] rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
                  <User className="w-5 h-5 text-[#0066ff]" />
                </div>
              )}
              {!logoUrl && ( // Only show text if no logo image is present
                <span
                  className="text-white font-bold text-xl"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {profile?.full_name?.split(' ')[0] || ""}
                </span>
              )}
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-black uppercase tracking-widest transition-all duration-300 ${
                    activeSection === item.id
                      ? "text-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="nav-glow"
                      className="absolute inset-0 rounded-lg border border-blue-500/50 blur-[2px]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
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
              className="md:hidden fixed inset-0 top-[60px] bg-[#0a0a0a]/98 backdrop-blur-xl border-t border-[#1a1a1a] z-[9998]"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 sm:px-6 py-4 space-y-2 max-h-[80vh] overflow-y-auto">
                {navItems.map(item => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      activeSection === item.id
                        ? "text-[#0066ff] bg-[#0066ff]/10"
                        : "text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1a]"
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
                {/* Language Switcher - Mobile */}
                <div className="flex items-center gap-4 pt-4 border-t border-[#333] mt-4">
                  <button
                    onClick={() => i18n.changeLanguage('en')}
                    className={`text-sm font-medium ${i18n.language === 'en' ? 'text-[#0066ff]' : 'text-[#a1a1aa]'}`}
                    aria-label="Switch to English"
                  >
                    EN
                  </button>
                  <span className="text-[#71717a]">|</span>
                  <button
                    onClick={() => i18n.changeLanguage('fr')}
                    className={`text-sm font-medium ${i18n.language === 'fr' ? 'text-[#0066ff]' : 'text-[#a1a1aa]'}`}
                    aria-label="Switch to French"
                  >
                    FR
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navigation;
