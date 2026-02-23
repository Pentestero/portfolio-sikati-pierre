import React from 'react';

const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER;

const FloatingWhatsApp: React.FC = () => {
  if (!phoneNumber) {
    return null; // Don't render if the number isn't set
  }

  const whatsappUrl = `https://wa.me/${phoneNumber}`;
  const whatsappIconUrl = "https://cdn.simpleicons.org/whatsapp/white"; // Official WhatsApp icon from SimpleIcons

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:bg-[#1DAE53] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform duration-300 ease-in-out hover:scale-110"
      aria-label="Contact me on WhatsApp"
    >
      <img src={whatsappIconUrl} alt="WhatsApp" className="w-8 h-8" />
    </a>
  );
};

export default FloatingWhatsApp;
