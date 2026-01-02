import React from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

interface DigitProps {
  onInteract?: () => void;
}

const DigitTwoCloud: React.FC<DigitProps> = ({ onInteract }) => {
  const [emojis, setEmojis] = React.useState<{ id: number; x: number; symbol: string }[]>([]);
  const controls = useAnimation();

  const spawnEmoji = () => {
    if (onInteract) onInteract();

    // Trigger snappy jump animation
    controls.stop();
    controls.set({ y: 0, scale: 1, rotate: 0 }); // Reset instantly
    controls.start({
      y: [0, -30, 0],
      scale: [1, 1.2, 1],
      rotate: [0, -5, 5, 0],
      transition: { duration: 0.3, ease: "easeOut" }
    });

    const id = Date.now();
    const x = Math.random() * 100 - 50;
    const symbols = ['😄', '🌞', '🌈', '😸', '✨', '🎈'];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];

    setEmojis((prev) => [...prev, { id, x, symbol }]);

    setTimeout(() => {
      setEmojis((prev) => prev.filter((e) => e.id !== id));
    }, 1500);
  };

  return (
    <div
      className="relative flex items-center justify-center w-full h-full overflow-visible cursor-pointer select-none"
      onClick={spawnEmoji}
    >

      {/* Floating Emojis Container */}
      <div className="absolute inset-0 overflow-visible pointer-events-none flex justify-center items-center z-50">
        <AnimatePresence>
          {emojis.map((emoji) => (
            <motion.div
              key={emoji.id}
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], y: -180, scale: 1.2, x: emoji.x }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute text-4xl"
            >
              {emoji.symbol}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Moving Clouds Background */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <motion.div
          className="absolute top-10 left-[-50px] text-white opacity-40 text-6xl"
          animate={{ x: [0, 400] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >☁️</motion.div>
        <motion.div
          className="absolute bottom-20 left-[-80px] text-white opacity-60 text-4xl delay-1000"
          animate={{ x: [0, 400] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }}
        >☁️</motion.div>
      </div>

      {/* Rainbow Arc behind */}
      <div className="absolute w-[200px] h-[100px] top-[25%] border-[10px] border-t-red-300 border-r-yellow-300 border-l-blue-300 border-b-transparent rounded-t-full opacity-30 blur-sm animate-pulse"></div>

      {/* The Digit Wrapper for Interactions */}
      <motion.div
        animate={controls}
        className="relative z-10 text-center"
      >
        {/* The Digit Inner for Idle Float */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span
            className="font-['Pacifico'] text-[14rem] md:text-[18rem] leading-none text-white drop-shadow-md select-none block"
            style={{
              textShadow: '4px 4px 0px #A6E3E9, 8px 8px 0px #E0BBE4',
              filter: 'drop-shadow(0px 10px 20px rgba(166, 227, 233, 0.5))'
            }}
          >
            2
          </span>

          {/* Little Cloud Fluff at base of number */}
          <div className="absolute -bottom-4 -left-4 text-6xl opacity-90">☁️</div>
          <div className="absolute -bottom-6 -right-8 text-5xl opacity-80">☁️</div>

          {/* Sparkles */}
          <motion.div
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 right-0 text-yellow-300 text-4xl"
          >✨</motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DigitTwoCloud;