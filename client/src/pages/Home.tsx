import { Helmet } from 'react-helmet-async';
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { usePortfolioStore } from "@/stores/portfolio";
import { useEffect } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation

export default function Home() {
  const { refreshAll } = usePortfolioStore();
  const { t } = useTranslation(); // Initialize useTranslation

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Helmet>
        <title>{t('home.welcomeMessage')}</title> {/* Use translated title */}
        <meta name="description" content={t('home.heroDescription')} /> {/* Use translated description */}
        {/* Potentially add Open Graph / Twitter Card tags here */}
      </Helmet>
      <Navigation />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}