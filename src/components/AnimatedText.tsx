'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const phrases = [
  "Empowering Future Engineers",
  "Building Tomorrow's Leaders",
  "Innovating Through Technology",
  "Connecting Minds, Creating Future",
  "Advancing Technical Excellence"
];

export default function AnimatedText() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-20 relative">
      <AnimatePresence mode="wait">
        <motion.h2
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute inset-0 text-2xl md:text-3xl text-center font-bold 
            bg-gradient-to-r from-orange-500 to-secondary text-transparent bg-clip-text"
        >
          {phrases[currentIndex]}
        </motion.h2>
      </AnimatePresence>
    </div>
  );
} 