'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Ripple {
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
}

export const RippleBackground = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    const generateRipples = () => {
      const newRipples: Ripple[] = [];
      for (let i = 0; i < 8; i++) {
        newRipples.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 80 + Math.random() * 120,
          opacity: 0.3 + Math.random() * 0.4,
          delay: i * 0.6
        });
      }
      setRipples(newRipples);
    };

    generateRipples();
    const interval = setInterval(generateRipples, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />
      
      {ripples.map((ripple, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-white"
          initial={{
            x: `${ripple.x}%`,
            y: `${ripple.y}%`,
            scale: 0,
            opacity: ripple.opacity
          }}
          animate={{
            scale: [0, ripple.size],
            opacity: [ripple.opacity, 0]
          }}
          transition={{
            duration: 3,
            ease: "easeOut",
            delay: ripple.delay,
            repeat: Infinity,
            repeatDelay: ripples.length * 0.6
          }}
          style={{
            width: '8px',
            height: '8px',
            transform: `translate(-50%, -50%)`,
            filter: 'blur(20px)',
            boxShadow: '0 0 40px 20px rgba(255,255,255,0.3)'
          }}
        />
      ))}
    </div>
  );
}; 