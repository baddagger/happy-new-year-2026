import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAudioContext } from '../utils/audio';

interface FlippableCardProps {
    children: React.ReactNode;
    backText: string;
    maxClicks?: number;
    resetTime?: number;
    className?: string;
    roundedClass?: string;
    flipPitch?: number;
    backColorClass?: string;
    forceOpen?: boolean;
    onUnlock?: () => void;
    onFlipChange?: (isFlipped: boolean) => void;
}

const FlippableCard: React.FC<FlippableCardProps> = ({
    children,
    backText,
    maxClicks = 5,
    resetTime = 3000,
    className = "",
    roundedClass = "rounded-3xl",
    flipPitch = 1.0,
    backColorClass = "bg-gradient-to-br from-red-500 to-rose-600",
    forceOpen = false,
    onUnlock,
    onFlipChange
}) => {
    const [clicks, setClicks] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);

    // Report flip state changes
    useEffect(() => {
        if (onFlipChange) {
            onFlipChange(isFlipped);
        }
    }, [isFlipped, onFlipChange]);

    // Simple Kawaii Sound Synth
    const playSound = (type: 'pop' | 'flip') => {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'pop') {
                // High pitched short "pop"
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.5, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.1);
            } else {
                // "Whoosh" / "Sparkle" flip sound
                osc.type = 'triangle';
                const baseFreq = 300 * flipPitch;
                const targetFreq = 600 * flipPitch;
                osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(targetFreq, ctx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.3);
            }
        } catch (e) {
            console.error("Audio play failed", e);
        }
    };

    const effectiveFlip = forceOpen || isFlipped;

    const handleClick = () => {
        if (effectiveFlip) return;

        if (isUnlocked) {
            playSound('flip');
            setIsFlipped(true);
            return;
        }

        playSound('pop');
        const newClicks = clicks + 1;
        setClicks(newClicks);

        if (newClicks >= maxClicks) {
            setTimeout(() => playSound('flip'), 100);
            setIsFlipped(true);
            setIsUnlocked(true);
            setClicks(0);
            if (onUnlock) onUnlock();
        }
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isFlipped && !forceOpen) {
            timer = setTimeout(() => {
                setIsFlipped(false);
            }, resetTime);
        }
        return () => clearTimeout(timer);
    }, [isFlipped, resetTime, forceOpen]);

    return (
        <div
            className={`perspective-1000 ${className}`}
            onClick={handleClick}
        >
            <motion.div
                className="w-full h-full relative preserve-3d"
                animate={{ rotateY: effectiveFlip ? 180 : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front Face */}
                <div className="absolute inset-0 w-full h-full backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
                    {children}
                </div>

                {/* Back Face */}
                <div
                    className={`absolute inset-0 w-full h-full backface-hidden overflow-hidden ${backColorClass} ${roundedClass} flex items-center justify-center shadow-2xl border-4 border-yellow-300`}
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}
                >
                    {/* Decorative pattern on back */}
                    <div className="absolute inset-2 border-2 border-yellow-200/50 rounded-2xl border-dashed"></div>
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                    <motion.h2
                        key={backText} // Re-animate when text changes
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: effectiveFlip ? 1 : 0.5, opacity: effectiveFlip ? 1 : 0 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="font-['Chewy'] text-[3.5rem] md:text-[4.5rem] text-yellow-100 drop-shadow-lg select-none text-center leading-tight p-4 relative z-20"
                        style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}
                    >
                        {backText}
                    </motion.h2>

                    {/* Sparkles */}
                    <div className="absolute top-4 right-4 text-4xl animate-bounce delay-100">✨</div>
                    <div className="absolute bottom-4 left-4 text-4xl animate-bounce delay-300">✨</div>
                </div>
            </motion.div>
        </div>
    );
};

export default FlippableCard;
