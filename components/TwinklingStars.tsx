import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';

interface Star {
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
}

export const TwinklingStars: React.FC<{ isActive: boolean }> = memo(({ isActive }) => {
    // Generate static star positions once
    const stars = useMemo(() => {
        const temp: Star[] = [];
        for (let i = 0; i < 50; i++) {
            temp.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: 1 + Math.random() * 2,
                delay: Math.random() * 5,
                duration: 2 + Math.random() * 3
            });
        }
        return temp;
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 z-[2] pointer-events-none overflow-hidden"
        >
            {stars.map(star => (
                <motion.div
                    key={star.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: star.size,
                        height: star.size,
                        boxShadow: '0 0 5px rgba(255, 255, 255, 0.8)'
                    }}
                    animate={{
                        opacity: [0.2, 1, 0.2],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        delay: star.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </motion.div>
    );
});
