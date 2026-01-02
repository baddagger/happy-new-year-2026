import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import DigitTwoPlush from './components/DigitTwoPlush';
import DigitZeroCoin from './components/DigitZeroCoin';
import DigitTwoCloud from './components/DigitTwoCloud';
import DigitSixGummy from './components/DigitSixGummy';
import FlippableCard from './components/FlippableCard';
import EmojiOverlay from './components/EmojiOverlay';
import { SubtleFireworks } from './components/SubtleFireworks';
import { TwinklingStars } from './components/TwinklingStars';

const INITIAL_TEXTS = ["甜蜜爱情", "财源滚滚", "心情舒畅", "身体健康"];
const FINAL_TEXTS = ["新", "年", "快", "乐"];

import { getAudioContext } from './utils/audio';

const App: React.FC = () => {
  const [currentFlipStatus, setCurrentFlipStatus] = useState<boolean[]>([false, false, false, false]);
  const [isEasterEggActive, setIsEasterEggActive] = useState(false);
  const [showEmojiOverlay, setShowEmojiOverlay] = useState(false);
  const [showFinalText, setShowFinalText] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [isGridExiting, setIsGridExiting] = useState(false);
  const [startMicroAnimations, setStartMicroAnimations] = useState(false);

  // Callback placeholder for card unlock (logic simplified)
  const handleUnlock = useCallback(() => { }, []);

  const handleFlipChange = useCallback((index: number, isFlipped: boolean) => {
    setCurrentFlipStatus(prev => {
      if (prev[index] === isFlipped) return prev;
      const newStatus = [...prev];
      newStatus[index] = isFlipped;
      return newStatus;
    });
  }, []);

  useEffect(() => {
    // Check if ALL cards are currently FLIPPED to back
    if (currentFlipStatus.every(s => s) && !isEasterEggActive) {
      startEasterEgg();
    }
  }, [currentFlipStatus, isEasterEggActive]);

  const playBubbleStream = () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const totalDuration = 2.0;
      const bubbleCount = 130; // Increased to maintain density over longer duration

      for (let i = 0; i < bubbleCount; i++) {
        // progress 0 to 1
        const progress = i / bubbleCount;

        // Randomize timing jitter (±0.1s) to break the mechanical rhythm
        const timingJitter = (Math.random() - 0.5) * 0.2;
        const startTime = ctx.currentTime + (progress * totalDuration) + timingJitter;
        if (startTime < ctx.currentTime) continue; // Skip if jitter pushed it to the past

        // Pitch rises overall, but each bubble has its own random offset
        const baseMultiplier = 1.0 + progress * 1.8;
        const pitchJitter = 0.85 + Math.random() * 0.3; // 85% to 115% of base
        const pitchMultiplier = baseMultiplier * pitchJitter;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'triangle';
        const baseFreq = 220 * pitchMultiplier;
        const targetFreq = 480 * pitchMultiplier;

        // Snappy bubble duration
        const duration = 0.08 + Math.random() * 0.07;

        osc.frequency.setValueAtTime(baseFreq, startTime);
        osc.frequency.exponentialRampToValueAtTime(targetFreq, startTime + duration);

        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        osc.start(startTime);
        osc.stop(startTime + duration);
      }
    } catch (e) {
      console.error("Audio stream failed", e);
    }
  };

  const [characterSpins, setCharacterSpins] = useState([0, 0, 0, 0]);

  const handleCharClick = (i: number) => {
    setCharacterSpins(prev => {
      const next = [...prev];
      next[i] += 360;
      return next;
    });
    // Play a festive pop sound on click
    try {
      const ctx = getAudioContext();
      if (ctx) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400 + Math.random() * 200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (e) { /* ignore */ }
  };

  const startEasterEgg = () => {
    setIsEasterEggActive(true);
    setCharacterSpins([0, 0, 0, 0]); // Reset spins

    // 1. Balanced delay: Wait 0.6s for the last flip to get halfway/mostly done before starting heavy particles
    setTimeout(() => {
      // 2. Start Emoji Balloon Rise
      setShowEmojiOverlay(true);
      playBubbleStream();

      // 3. Ultra-Fast Sequential Exit (Delayed for optimal visual weight)
      setTimeout(() => {
        setIsGridExiting(true);
      }, 1100);

      setTimeout(() => {
        setShowFinalText(true);
      }, 1400);

      // 4. Subtle background celebration starts later
      setTimeout(() => {
        setShowFireworks(true);
      }, 2600);

      setTimeout(() => {
        setStartMicroAnimations(true);
      }, 1800);

      // 5. Overlay clean up
      setTimeout(() => {
        setShowEmojiOverlay(false);
      }, 4000);
    }, 1200);
  };

  return (
    <main
      className="relative h-screen w-full bg-gradient-to-br from-[#FFF5F5] via-[#FFF0F5] to-[#F0F8FF] text-[#4A4A4A] flex items-center justify-center overflow-hidden"
    >
      {/* BACKGROUND LAYERS (Full Screen) */}
      <motion.div
        initial={false}
        animate={{ opacity: isGridExiting ? 0 : 0.1 }}
        transition={{ duration: 1.3, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(#FFB7B2 2px, transparent 2px), radial-gradient(#A6E3E9 2px, transparent 2px)`,
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px'
        }}>
      </motion.div>

      <motion.div
        className="absolute inset-0 bg-black pointer-events-none z-[1]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isGridExiting ? 1 : 0 }}
        transition={{ duration: 1.3, ease: "easeInOut" }}
      />

      <TwinklingStars isActive={showFireworks} />
      <EmojiOverlay isActive={showEmojiOverlay} />
      <SubtleFireworks isActive={showFireworks} />

      {/* CONTENT LAYER (Square Layout) */}
      <div className="relative w-[100vmin] h-[100vmin] aspect-square flex flex-col items-center justify-center pointer-events-none overflow-hidden">

        {/* FINAL CELEBRATION LAYER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showFinalText ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          style={{ display: showFinalText ? 'flex' : 'none' }}
          className={`absolute inset-0 z-20 flex items-center justify-center p-4 md:p-8 pointer-events-none`}
        >
          <div className={`grid grid-cols-2 items-center justify-center gap-x-8 gap-y-8 sm:gap-x-12 sm:gap-y-12 md:gap-x-20 md:gap-y-20 text-center ${showFinalText ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            {FINAL_TEXTS.map((char, i) => {
              // Map back to card colors: Pink, Yellow, Blue, Green
              const shadowColors = [
                '2px 2px 0px #FB7185, 5px 5px 0px #BE123C', // 新: Pink/Rose
                '2px 2px 0px #FB923C, 5px 5px 0px #EA580C', // 年: Orange (Brightened)
                '2px 2px 0px #38BDF8, 5px 5px 0px #075985', // 快: Sky/Blue
                '2px 2px 0px #34D399, 5px 5px 0px #065F46'  // 乐: Emerald/Green
              ];

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={showFinalText ? {
                    opacity: 1,
                    scale: 1,
                    y: startMicroAnimations ? [0, -15, 0] : 0,
                    rotate: startMicroAnimations ? [0, 1, 0, -1, 0] : 0,
                  } : { opacity: 0, scale: 0.5 }}
                  transition={{
                    default: { duration: 0.8, ease: "backOut" },
                    y: { duration: 5 + i, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 6 + i, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="inline-block"
                >
                  <motion.span
                    animate={{ rotate: characterSpins[i] }}
                    transition={{ type: "spring", damping: 10, stiffness: 100 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleCharClick(i)}
                    className="inline-block font-['PingFang_SC','Hiragino_Sans_GB','Microsoft_YaHei','sans-serif'] font-black text-[10rem] sm:text-[14rem] md:text-[16rem] lg:text-[18rem] text-[#F8B400] leading-none cursor-pointer select-none"
                    style={{ textShadow: shadowColors[i] }}
                  >
                    {char}
                  </motion.span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          animate={{
            opacity: isGridExiting ? 0 : 1,
            scale: isGridExiting ? [1, 1.02, 0] : 1,
            filter: isGridExiting ? 'blur(10px)' : 'blur(0px)'
          }}
          transition={{
            duration: isGridExiting ? 0.8 : 0,
            times: [0, 0.4, 1],
            ease: "easeInOut"
          }}
          onAnimationComplete={() => {
            if (isGridExiting) {
              // We can use a local state or just trust the opacity/scale for visual hiding.
              // For cleaner DOM, we can set display via style if needed,
              // but scale 0 + opacity 0 is usually enough.
            }
          }}
          style={{
            pointerEvents: isGridExiting ? 'none' : 'auto',
            display: 'flex'
          }}
          className="z-10 w-[90%] h-[90%] flex items-center justify-center"
        >

          {/* The Grid of Digits */}
          {/* On Mobile: Stack Vertically or 2x2. Desktop: 4 in a row */}
          <div className="grid grid-cols-2 grid-rows-2 gap-6 md:gap-10 w-full h-full items-center justify-items-center">

            {/* 2 - Plushie (Pink) -> Do (1.0) */}
            <FlippableCard
              key="c1"
              backText={INITIAL_TEXTS[0]}
              className="w-full h-full max-h-[90%]"
              roundedClass="rounded-3xl"
              flipPitch={1.0}
              backColorClass="bg-gradient-to-br from-pink-400 to-rose-400"
              onUnlock={handleUnlock}
              onFlipChange={(isFlipped) => handleFlipChange(0, isFlipped)}
              forceOpen={isEasterEggActive}
              resetTime={5000}
            >
              <div className="w-full h-full flex items-center justify-center relative group bg-transparent">
                <div className="absolute inset-4 bg-white/40 rounded-3xl -rotate-2 group-hover:rotate-0 transition-transform duration-300 shadow-sm border border-pink-100"></div>
                <DigitTwoPlush />
              </div>
            </FlippableCard>

            {/* 0 - Coin (Yellow) -> Re (1.125) */}
            <FlippableCard
              key="c2"
              backText={INITIAL_TEXTS[1]}
              className="w-full h-full max-h-[90%]"
              roundedClass="rounded-3xl"
              flipPitch={1.125}
              backColorClass="bg-gradient-to-br from-yellow-400 to-orange-400"
              onUnlock={handleUnlock}
              onFlipChange={(isFlipped) => handleFlipChange(1, isFlipped)}
              forceOpen={isEasterEggActive}
              resetTime={5000}
            >
              <div className="w-full h-full flex items-center justify-center relative group bg-transparent">
                <div className="absolute inset-4 bg-white/40 rounded-3xl group-hover:scale-105 transition-transform duration-300 shadow-sm border border-yellow-100"></div>
                <DigitZeroCoin />
              </div>
            </FlippableCard>

            {/* 2 - Cloud (Blue) -> Mi (1.25) */}
            <FlippableCard
              key="c3"
              backText={INITIAL_TEXTS[2]}
              className="w-full h-full max-h-[90%]"
              roundedClass="rounded-3xl"
              flipPitch={1.25}
              backColorClass="bg-gradient-to-br from-blue-400 to-cyan-400"
              onUnlock={handleUnlock}
              onFlipChange={(isFlipped) => handleFlipChange(2, isFlipped)}
              forceOpen={isEasterEggActive}
              resetTime={5000}
            >
              <div className="w-full h-full flex items-center justify-center relative group bg-transparent">
                <div className="absolute inset-4 bg-blue-50/50 rounded-3xl rotate-2 group-hover:rotate-0 transition-transform duration-300 shadow-sm border border-blue-100"></div>
                <DigitTwoCloud />
              </div>
            </FlippableCard>

            {/* 6 - Gummy (Green) -> Fa/Sol (1.5) */}
            <FlippableCard
              key="c4"
              backText={INITIAL_TEXTS[3]}
              className="w-full h-full max-h-[90%]"
              roundedClass="rounded-3xl"
              flipPitch={1.5}
              backColorClass="bg-gradient-to-br from-green-400 to-emerald-400"
              onUnlock={handleUnlock}
              onFlipChange={(isFlipped) => handleFlipChange(3, isFlipped)}
              forceOpen={isEasterEggActive}
              resetTime={5000}
            >
              <div className="w-full h-full flex items-center justify-center relative group bg-transparent">
                <div className="absolute inset-4 bg-green-50/50 rounded-3xl -rotate-1 group-hover:rotate-1 transition-transform duration-300 shadow-sm border border-green-100"></div>
                <DigitSixGummy />
              </div>
            </FlippableCard>

          </div>

        </motion.div>
      </div>
    </main>
  );
};

export default App;