import React, { useState, useEffect, memo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAudioContext, getNoiseBuffer } from '../utils/audio';

interface Firework {
    id: number;
    x: number;
    y: number;
    color: string;
    scale: number;
    duration: number; // Animation duration in seconds
}

const COLORS = ['#FF6B6B', '#4D96FF', '#6BCB77', '#FFD93D', '#FF8AAE', '#B983FF'];

export const SubtleFireworks: React.FC<{ isActive: boolean }> = memo(({ isActive }) => {
    const [fireworks, setFireworks] = useState<Firework[]>([]);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const playFireworkSound = useCallback((scale: number, duration: number) => {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            const t = ctx.currentTime;

            // REALISTIC EXPLOSION SYNTHESIS: Subtractive Synthesis using Noise
            // 1. Get Shared White Noise Buffer
            const buffer = getNoiseBuffer(ctx);

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            // 2. Filter - The key to "Boom" vs "Hiss"
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            // Start somewhat open for the "Crack" then immediately close for the "Rumble"
            // Larger fireworks = lower cutoff
            const startFreq = 600 - (scale * 100);
            filter.frequency.setValueAtTime(startFreq, t);
            filter.frequency.exponentialRampToValueAtTime(10, t + duration * 0.8);

            // 3. Envelope
            const gain = ctx.createGain();
            // Start silent
            gain.gain.setValueAtTime(0, t);
            // Sharp attack
            gain.gain.linearRampToValueAtTime(0.75 * scale, t + 0.05);
            // Exponential decay to silence
            gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            noise.start(t);
            noise.stop(t + duration);

        } catch (e) {
            // ignore
        }
    }, []);

    useEffect(() => {
        if (!isActive) {
            setFireworks([]);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            return;
        }

        const spawnFirework = () => {
            const id = Date.now() + Math.random();
            const x = 5 + Math.random() * 90;
            const y = 5 + Math.random() * 70;
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            const scale = 0.8 + Math.random() * 1.7;
            const duration = 0.8 + Math.random() * 1.2;

            setFireworks(prev => [...prev, { id, x, y, color, scale, duration }]);
            playFireworkSound(scale, duration);

            // Auto-remove after animation
            setTimeout(() => {
                setFireworks(prev => prev.filter(f => f.id !== id));
            }, duration * 1000 + 100); // Wait slightly longer than animation

            // Slower, random intervals: 0.5s to 1.5s
            const nextDelay = 500 + Math.random() * 1000;
            timeoutRef.current = setTimeout(spawnFirework, nextDelay);
        };

        // Start loop
        spawnFirework();

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isActive, playFireworkSound]);

    return (
        <div className="absolute inset-0 z-[15] pointer-events-none overflow-hidden">
            <AnimatePresence>
                {fireworks.map(f => (
                    <div
                        key={f.id}
                        className="absolute"
                        style={{
                            left: `${f.x}%`,
                            top: `${f.y}%`,
                            transform: `translate(-50%, -50%) scale(${f.scale})`
                        }}
                    >
                        {/* Center core */}
                        <motion.div
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: [0, 1.5, 0], opacity: [1, 0.8, 0] }}
                            transition={{ duration: f.duration * 0.6, ease: "easeOut" }}
                            className="w-3 h-3 rounded-full absolute top-0 left-0 -mt-1.5 -ml-1.5"
                            style={{ backgroundColor: f.color, filter: 'blur(2px)' }}
                        />

                        {/* Spokes/Particles */}
                        {Array.from({ length: 12 }).map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                animate={{
                                    x: Math.cos(i * 30 * (Math.PI / 180)) * 60,
                                    y: Math.sin(i * 30 * (Math.PI / 180)) * 60,
                                    opacity: 0,
                                    scale: 0.2
                                }}
                                transition={{ duration: f.duration, ease: "easeOut" }}
                                className="absolute w-1.5 h-1.5 rounded-full"
                                style={{
                                    backgroundColor: f.color,
                                    boxShadow: `0 0 6px ${f.color}`,
                                    top: 0,
                                    left: 0,
                                    marginTop: '-3px',
                                    marginLeft: '-3px'
                                }}
                            />
                        ))}
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
});
