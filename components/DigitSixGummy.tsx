import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DigitProps {
  onInteract?: () => void;
}

const DigitSixGummy: React.FC<DigitProps> = ({ onInteract }) => {
  const [leaves, setLeaves] = React.useState<{ id: number; x: number; rot: number; symbol: string }[]>([]);

  const spawnLeaf = () => {
    if (onInteract) onInteract();
    const id = Date.now();
    const x = Math.random() * 100 - 50;
    const rot = Math.random() * 360;
    const symbols = ['🍃', '🌿', '🌱', '🍀', '🌵'];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];

    setLeaves((prev) => [...prev, { id, x, rot, symbol }]);

    setTimeout(() => {
      setLeaves((prev) => prev.filter((l) => l.id !== id));
    }, 1500);
  };

  return (
    <div
      className="relative flex items-center justify-center w-full h-full cursor-pointer select-none"
      onClick={spawnLeaf}
    >
      {/* Floating Leaves Container */}
      <div className="absolute inset-0 overflow-visible pointer-events-none flex justify-center items-center z-50">
        <AnimatePresence>
          {leaves.map((leaf) => (
            <motion.div
              key={leaf.id}
              initial={{ opacity: 0, y: 0, scale: 0.5, rotate: leaf.rot }}
              animate={{ opacity: [0, 1, 0], y: -180, scale: 1.2, x: leaf.x, rotate: leaf.rot + 180 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute text-4xl"
            >
              {leaf.symbol}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* Background Splat */}
      {/* Background Splat */}
      <svg className="absolute w-[220px] h-[220px] md:w-[300px] md:h-[300px] opacity-30 text-green-400 animate-pulse" viewBox="0 0 200 200">
        <path fill="currentColor" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.3C87.4,-33.5,90.1,-17.9,88.4,-2.9C86.6,12.1,80.4,26.5,70.9,38.5C61.4,50.5,48.7,60.1,35.1,66.8C21.5,73.5,7.1,77.3,-5.7,75.1C-18.5,72.9,-29.7,64.7,-41.8,57.1C-53.9,49.5,-66.9,42.5,-75.8,31.2C-84.7,19.9,-89.5,4.3,-87.3,-10.3C-85.1,-24.9,-75.9,-38.5,-64.2,-48.9C-52.5,-59.3,-38.3,-66.5,-24.4,-70.6C-10.5,-74.7,3.1,-75.7,17.2,-74.2" transform="translate(100 100)" />
      </svg>

      {/* Bouncing Container */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9, rotate: -10 }}
        className="relative cursor-pointer"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", bounce: 0.6 }}
      >
        <div className="relative font-['Rubik_Bubbles'] text-[12rem] md:text-[16rem] leading-none text-green-400 select-none">
          {/* Main Character */}
          <span
            className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-lime-300 to-green-500"
            style={{
              filter: 'drop-shadow(0 10px 10px rgba(74, 222, 128, 0.4))'
            }}
          >
            6
          </span>

          {/* Highlight Layer for "Wet/Shiny" Look */}
          <span className="absolute inset-0 text-white opacity-40 z-20 mix-blend-overlay mask-image-gradient">
            6
          </span>

          {/* White Specular Highlights manually positioned */}
          <div className="absolute top-[20%] left-[25%] w-8 h-8 bg-white rounded-full blur-[2px] opacity-80 z-30"></div>
          <div className="absolute top-[25%] left-[20%] w-3 h-3 bg-white rounded-full blur-[1px] opacity-90 z-30"></div>

          {/* Drip Animation */}
          <motion.div
            className="absolute bottom-10 left-[30%] w-4 h-6 bg-green-400 rounded-full z-0"
            animate={{ y: [0, 20, 0], height: [24, 40, 24], opacity: [1, 0.8, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          ></motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DigitSixGummy;