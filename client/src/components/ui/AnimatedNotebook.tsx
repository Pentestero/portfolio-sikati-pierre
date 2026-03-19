import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, History, Rocket, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NotebookPage {
  id: string;
  title: string;
  content: string;
  icon: React.ElementType;
  color: string; // Tailwind color class for text and border, e.g., 'text-blue-400'
  gradient: string; // Tailwind gradient class for background glow, e.g., 'from-blue-500 to-cyan-500'
}

const AnimatedNotebook = ({ pages }: { pages: NotebookPage[] }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0); // 0 for initial, 1 for next, -1 for prev
  const { t } = useTranslation();

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentPage((prevPage) => {
      const newPage = prevPage + newDirection;
      if (newPage < 0) return pages.length - 1;
      if (newPage >= pages.length) return 0;
      return newPage;
    });
  };

  // Variantes d'animation Page Flip améliorées pour un défilement plus organique
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '50%' : '-50%',
      opacity: 0,
      rotateY: direction > 0 ? -10 : 10,
      scale: 0.9,
    }),
    center: {
      x: '0%',
      opacity: 1,
      rotateY: 0,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        rotateY: { type: "spring", stiffness: 300, damping: 30 },
        scale: { type: "spring", stiffness: 300, damping: 30 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '50%' : '-50%',
      opacity: 0,
      rotateY: direction < 0 ? -10 : 10,
      scale: 0.9,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        rotateY: { type: "spring", stiffness: 300, damping: 30 },
        scale: { type: "spring", stiffness: 300, damping: 30 },
      },
    }),
  };

  if (!pages || pages.length === 0) return null;

  const page = pages[currentPage];

  return (
    <motion.div
      className="relative w-full h-auto bg-[#1a1a1a] rounded-3xl p-4 sm:p-6 border border-white/5 shadow-xl flex flex-col"
      style={{ perspective: 1200 }}
    >
      {/* Dynamic Glow Border */}
      <motion.div 
        className={`absolute -inset-0.5 bg-gradient-to-r ${page.gradient} rounded-3xl blur opacity-20`}
        initial={{ opacity: 0.2 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
      />
      
      <div className="relative z-10 flex flex-col flex-grow">
        {/* Header & Navigation */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${page.color.replace('text-', 'border-').replace('-400', '-500/20').replace('-500', '-500/20').replace('-600', '-600/20')} ${page.color.replace('text-', 'bg-').replace('-400', '-500/10').replace('-500', '-500/10').replace('-600', '-600/10')}`}>
              <page.icon className={`w-4 h-4 ${page.color}`} />
            </div>
            {page.title}
          </h3>
          <div className="flex items-center gap-3">
            {/* Page Number */}
            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">
              {currentPage + 1} / {pages.length}
            </span>
            {/* Navigation Buttons */}
            <div className="flex gap-1">
              <motion.button
                onClick={() => paginate(-1)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => paginate(1)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Page Content Container */}
        <div className="relative flex-grow min-h-[150px] sm:min-h-[200px]"> {/* Add a min-height for content container to prevent collapse */}
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentPage}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 p-0 text-gray-300 leading-relaxed text-sm sm:text-base overflow-y-auto custom-scrollbar"
              style={{ originX: direction > 0 ? 0 : 1, originY: 0.5 }}
            >
              {page.content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default AnimatedNotebook;
