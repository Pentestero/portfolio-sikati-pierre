import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePortfolioStore } from "@/stores/portfolio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Send,
  MessageCircle,
  Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next"; // Import useTranslation

const Contact = () => {
  const { contactInfo, fetchContactInfo, addMessage } = usePortfolioStore();
  const { t } = useTranslation(); // Initialize useTranslation

  useEffect(() => {
    if (!contactInfo) {
      fetchContactInfo();
    }
  }, [contactInfo, fetchContactInfo]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addMessage({ name, email, subject, message, is_read: false });
      toast.success(t("home.contactFormSuccess")); // Translated toast message
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error: any) {
      // Add : any to error for type safety
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error(
        t("home.contactFormError", {
          errorMessage: error.message || t("common.unknownError"),
        })
      ); // Translated toast message, with translated fallback error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayEmail = contactInfo?.email || "sikati.pierre@example.com";
  const displayPhone = contactInfo?.phone || "+237 XXX XXX XXX";
  const displayLocation = contactInfo?.location || t("home.locationLabel"); // Translated fallback
  const displayGithubUrl = contactInfo?.github_url
    ? contactInfo.github_url.startsWith("http://") ||
      contactInfo.github_url.startsWith("https://")
      ? contactInfo.github_url
      : `https://${contactInfo.github_url}`
    : "https://github.com/sikati";
  const displayLinkedinUrl = contactInfo?.linkedin_url
    ? contactInfo.linkedin_url.startsWith("http://") ||
      contactInfo.linkedin_url.startsWith("https://")
      ? contactInfo.linkedin_url
      : `https://${contactInfo.linkedin_url}`
    : "https://linkedin.com/in/sikati-pierre";

  const contactItems = [
    {
      icon: Mail,
      label: t("home.emailLabel"), // Translated label
      value: displayEmail,
      href: `mailto:${displayEmail}`,
      color: "from-[#0066ff] to-[#0052cc]",
    },
    {
      icon: Phone,
      label: t("home.phoneLabel"), // Translated label
      value: displayPhone,
      href: `tel:${displayPhone}`,
      color: "from-[#10b981] to-[#059669]",
    },
    {
      icon: MapPin,
      label: t("home.locationLabel"), // Translated label
      value: displayLocation,
      href: "#",
      color: "from-[#f59e0b] to-[#d97706]",
    },
  ];

  const socialItems = [
    {
      icon: Github,
      label: t("home.githubLabel"), // Translated label
      href: displayGithubUrl,
      color: "from-[#333] to-[#1a1a1a]",
    },
    {
      icon: Linkedin,
      label: t("home.linkedinLabel"), // Translated label
      href: displayLinkedinUrl,
      color: "from-[#0077b5] to-[#005885]",
    },
  ];

  return (
    <section
      id="contact"
      className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#0066ff]/10 rounded-full blur-[80px] sm:blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#8b5cf6]/10 rounded-full blur-[80px] sm:blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-3 sm:px-4 py-1.5 bg-[#0066ff]/10 border border-[#0066ff]/30 rounded-full text-[#0066ff] text-xs sm:text-sm font-medium mb-3 sm:mb-4"
          >
            {t("home.letsStayInTouch")}
          </motion.span>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t("home.contactMeSection")}
          </h2>
          <p className="text-[#a1a1aa] text-sm sm:text-lg max-w-2xl mx-auto px-2 sm:px-0">
            {t("home.questionOrProject")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-[#1a1a1a] border-[#333] h-full">
              <CardContent className="p-5 sm:p-8">
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="w-10 h-10 bg-[#0066ff]/10 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-[#0066ff]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {t("home.sendMessage")}
                  </h3>
                </div>

                <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm text-[#a1a1aa] mb-2">
                        {t("home.yourName")}
                      </label>
                      <Input
                        type="text"
                        className="bg-[#262626] border-[#333] text-white placeholder-[#52525b] focus:border-[#0066ff]"
                        placeholder={t("home.yourName")}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#a1a1aa] mb-2">
                        {t("home.emailLabel")}
                      </label>
                      <Input
                        type="email"
                        className="bg-[#262626] border-[#333] text-white placeholder-[#52525b] focus:border-[#0066ff]"
                        placeholder={t("home.yourEmail")}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-[#a1a1aa] mb-2">
                      {t("home.subject")}
                    </label>
                    <Input
                      type="text"
                      className="bg-[#262626] border-[#333] text-white placeholder-[#52525b] focus:border-[#0066ff]"
                      placeholder={t("home.subject")}
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#a1a1aa] mb-2">
                      {t("home.yourMessage")}
                    </label>
                    <Textarea
                      rows={4}
                      className="bg-[#262626] border-[#333] text-white placeholder-[#52525b] focus:border-[#0066ff] resize-none"
                      placeholder={t("home.yourMessage")}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full"
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#0066ff] to-[#0052cc] hover:from-[#0052cc] hover:to-[#003d99] text-white py-3 sm:py-3.5 font-semibold"
                      disabled={isSubmitting} // Disable during submission
                    >
                      <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      {isSubmitting
                        ? t("common.sending")
                        : t("home.sendMessageBtn")}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Contact Cards */}
            <div className="grid gap-3 sm:gap-4">
              {contactItems.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-[#1a1a1a] border border-[#333] rounded-xl hover:border-[#0066ff]/50 transition-all group"
                  whileHover={{ x: 5 }}
                  initial={{ opacity: 0, y: 20 }} // Add initial state
                  whileInView={{ opacity: 1, y: 0 }} // Animate when in view
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }} // Staggered delay
                >
                  <div
                    className={`w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <item.icon className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-[#71717a] mb-0.5">
                      {item.label}
                    </div>
                    <div className="text-white font-medium text-sm sm:text-base break-words">{item.value}</div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {socialItems.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 bg-[#1a1a1a] border border-[#333] rounded-xl hover:border-[#0066ff]/50 transition-all group"
                  whileHover={{ y: -3 }}
                  initial={{ opacity: 0, y: 20 }} // Add initial state
                  whileInView={{ opacity: 1, y: 0 }} // Animate when in view
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }} // Staggered delay, slight offset
                >
                  <item.icon className="w-4 sm:w-5 h-4 sm:h-5 text-[#a1a1aa] group-hover:text-white transition-colors" />
                  <span className="text-[#a1a1aa] group-hover:text-white font-medium text-sm transition-colors">
                    {item.label}
                  </span>
                </motion.a>
              ))}
            </div>

            {/* Availability Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-[#10b981]/10 to-[#059669]/10 border border-[#10b981]/20 rounded-xl p-4 sm:p-6"
            >
              <div className="flex items-center gap-3 mb-2 sm:mb-3">
                <div className="w-3 h-3 bg-[#10b981] rounded-full animate-pulse" />
                <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-[#10b981]" />
                <span className="text-[#10b981] font-semibold text-sm sm:text-base">
                  {t("home.available")}
                </span>
              </div>
              <p className="text-[#a1a1aa] text-xs sm:text-sm">
                {t("home.openToOpportunities")}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
