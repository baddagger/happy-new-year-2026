import React, { useState, useEffect, useRef, memo } from 'react';

interface EmojiOverlayProps {
    isActive: boolean;
}

interface Particle {
    id: number;
    emoji: string;
    style: React.CSSProperties;
}

const EMOJIS = ['🎈', '✨', '🎉', '🧧', '🍊', '🐉', '❤️', '💰', '🍬', '🌸'];

const EmojiOverlay: React.FC<EmojiOverlayProps> = memo(({ isActive }) => {
    const [particles, setParticles] = useState<Particle[]>([]);
    const nextId = useRef(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isActive) {
            // Start spawning particles
            // Rapid fire: 300 particles
            const spawnBatchSize = 40;
            const spawnInterval = 30;
            const maxParticles = 300;
            let currentCount = 0;

            intervalRef.current = setInterval(() => {
                if (currentCount >= maxParticles) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    return;
                }

                const newBatch: Particle[] = Array.from({ length: spawnBatchSize }).map(() => {
                    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
                    const left = Math.random() * 140 - 20;
                    const size = 8 + Math.random() * 14;
                    const duration = 0.8 + Math.random() * 1.2;
                    const rotateStart = Math.random() * 360;
                    const rotateEnd = rotateStart + 360 * (Math.random() > 0.5 ? 1 : -1);
                    const id = nextId.current++;

                    return {
                        id,
                        emoji,
                        style: {
                            left: `${left}%`,
                            fontSize: `${size}rem`,
                            animationDuration: `${duration}s`,
                            '--rotate-start': `${rotateStart}deg`,
                            '--rotate-end': `${rotateEnd}deg`,
                        } as React.CSSProperties
                    };
                });

                setParticles(prev => [...prev, ...newBatch]);
                currentCount += spawnBatchSize;

                // Cleanup particles after they finish animation (~5s max)
                newBatch.forEach(p => {
                    setTimeout(() => {
                        setParticles(prev => prev.filter(item => item.id !== p.id));
                    }, 3000);
                });

            }, spawnInterval);
        } else {
            // Clear everything if inactive
            if (intervalRef.current) clearInterval(intervalRef.current);
            setParticles([]);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive]);

    if (!isActive && particles.length === 0) return null;

    return (
        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
            <style>
                {`
          @keyframes floatUp {
            0% {
              transform: translate3d(0, 105vh, 0) rotate(var(--rotate-start));
              opacity: 1;
            }
            100% {
              transform: translate3d(0, -130vh, 0) rotate(var(--rotate-end));
              opacity: 1;
            }
          }
        `}
            </style>

            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute top-0 select-none will-change-transform"
                    style={{
                        ...p.style,
                        zIndex: 10,
                        animationName: 'floatUp',
                        animationTimingFunction: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
                        animationFillMode: 'forwards',
                    }}
                >
                    {p.emoji}
                </div>
            ))}
        </div>
    );
});

export default EmojiOverlay;
