import { motion } from "framer-motion";
import { useThemeStore } from "@/stores";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: "light" | "dark" | "gradient";
}

const Section = ({
  children,
  className,
  id,
  background = "light",
}: SectionProps) => {
  const { theme } = useThemeStore();

  const backgrounds = {
    light: "bg-off-white",
    dark: "bg-charcoal text-off-white",
    gradient: "bg-gradient-to-br from-charcoal to-dark-blue text-off-white",
  };

  return (
    <motion.section
      id={id}
      className={cn(
        "min-h-screen py-20 px-6 md:px-12 lg:px-24",
        backgrounds[background],
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto">{children}</div>
    </motion.section>
  );
};

const SectionHeader = ({
  title,
  subtitle,
  description,
  centered = false,
}: {
  title: string;
  subtitle?: string;
  description?: string;
  centered?: boolean;
}) => {
  return (
    <motion.div
      className={cn("mb-16", centered && "text-center")}
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {subtitle && (
        <motion.p
          className="text-electric-blue font-semibold text-lg mb-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}
      <motion.h2
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal dark:text-off-white mb-6"
        style={{ fontFamily: "Playfair Display, serif" }}
        initial={{ opacity: 0, x: centered ? 0 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          className="text-slate-gray dark:text-slate-gray text-lg max-w-3xl leading-relaxed"
          initial={{ opacity: 0, x: centered ? 0 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
};

export { Section, SectionHeader };
