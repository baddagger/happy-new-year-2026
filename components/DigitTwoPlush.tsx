import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DigitProps {
  onInteract?: () => void;
}

const DigitTwoPlush: React.FC<DigitProps> = ({ onInteract }) => {
  const [hearts, setHearts] = useState<{ id: number; x: number }[]>([]);

  const spawnHeart = () => {
    if (onInteract) onInteract();
    const id = Date.now();
    const x = Math.random() * 100 - 50; // Random x offset
    setHearts((prev) => [...prev, { id, x }]);

    // Cleanup heart after animation
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1500);
  };

  return (
    <div
      className="relative flex items-center justify-center w-full h-full cursor-pointer select-none"
      onClick={spawnHeart}
      onMouseEnter={spawnHeart}
    >
      {/* Background soft glow */}
      <div className="absolute inset-0 bg-pink-300/20 blur-[60px] rounded-full scale-75" />

      {/* Floating Hearts Container */}
      <div className="absolute inset-0 overflow-visible pointer-events-none flex justify-center items-center">
        <AnimatePresence>
          {hearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], y: -150, scale: 1.2, x: heart.x }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute text-4xl text-pink-400"
            >
              ♥
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* The Plush Digit */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: [-5, 5, -5, 0] }}
        whileTap={{ scale: 0.9 }}
        transition={{
          scale: { type: "spring", stiffness: 300, damping: 10 },
          rotate: { duration: 0.5 }
        }}
        className="relative z-10"
      >
        <span
          className="font-['Fredoka'] font-bold text-[12rem] md:text-[16rem] leading-none text-pink-400 block drop-shadow-xl"
          style={{
            textShadow: '0 0 20px rgba(255, 182, 193, 0.8), 4px 4px 0px rgba(255, 105, 180, 0.2)',
            filter: 'contrast(1.1)'
          }}
        >
          2
        </span>

        {/* "Fur" texture overlay effect */}
        <div className="absolute inset-0 mix-blend-overlay opacity-30 bg-white rounded-3xl"
          style={{ maskImage: 'linear-gradient(to bottom, black, transparent)' }}></div>

        {/* Cute Face Eyes */}
        {/* Cute Face Eyes */}
        <div className="absolute top-[35%] left-[25%] flex space-x-12 opacity-80 pointer-events-none">
          <div className="w-4 h-6 bg-gray-800 rounded-full animate-blink"></div>
          <div className="w-4 h-6 bg-gray-800 rounded-full animate-blink"></div>
        </div>
        {/* Blush */}
        <div className="absolute top-[45%] left-[18%] flex space-x-16 opacity-60 pointer-events-none">
          <div className="w-6 h-3 bg-pink-500 rounded-full blur-sm"></div>
          <div className="w-6 h-3 bg-pink-500 rounded-full blur-sm"></div>
        </div>
      </motion.div>

      <style>{`
        @keyframes blink {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.1); }
        }
        .animate-blink {
          animation: blink 4s infinite;
        }
      `}</style>
    </div>
  );
};

export default DigitTwoPlush;