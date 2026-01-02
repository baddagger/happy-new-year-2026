import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DigitProps {
    onInteract?: () => void;
}

const DigitZeroCoin: React.FC<DigitProps> = ({ onInteract }) => {
    const [banknotes, setBanknotes] = useState<{ id: number; x: number; rot: number }[]>([]);

    const spawnBanknote = () => {
        if (onInteract) onInteract();
        const id = Date.now();
        const x = Math.random() * 100 - 50; // Random x offset
        const rot = Math.random() * 40 - 20; // Random rotation
        setBanknotes((prev) => [...prev, { id, x, rot }]);

        // Cleanup after animation
        setTimeout(() => {
            setBanknotes((prev) => prev.filter((b) => b.id !== id));
        }, 2000);
    };

    return (
        <div
            className="relative flex items-center justify-center w-full h-full p-8 cursor-pointer select-none"
            onClick={spawnBanknote}
        >
            {/* Floating Banknotes Container */}
            <div className="absolute inset-0 overflow-visible pointer-events-none flex justify-center items-center z-50">
                <AnimatePresence>
                    {banknotes.map((note) => (
                        <motion.div
                            key={note.id}
                            initial={{ opacity: 0, y: 0, scale: 0.5, rotate: note.rot }}
                            animate={{ opacity: [0, 1, 0], y: -200, scale: 1.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="absolute text-5xl"
                            style={{ x: note.x }}
                        >
                            💵
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-[200px] h-[200px] md:w-[260px] md:h-[260px]"
            >
                {/* Coin Body */}
                <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 shadow-xl border-4 border-yellow-200 flex items-center justify-center relative overflow-hidden ring-4 ring-yellow-400/50">

                    {/* Inner Ring */}
                    <div className="absolute inset-4 rounded-full border-2 border-yellow-200/50 border-dashed opacity-70"></div>

                    {/* Shine effect */}
                    <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/40 to-transparent w-[200%] h-[200%] animate-spin-slow opacity-50"
                        style={{ animationDuration: '3s' }}></div>

                    {/* The Number 0 */}
                    <span className="font-['Chewy'] text-[10rem] md:text-[12rem] text-yellow-100 drop-shadow-md z-10"
                        style={{ textShadow: '2px 2px 0px #B7791F' }}>
                        0
                    </span>

                    {/* Sparkle */}
                    <motion.div
                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        className="absolute top-8 right-8 text-white text-4xl font-bold"
                    >✦</motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default DigitZeroCoin;
