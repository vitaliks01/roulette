import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { RouletteResult } from '../../types/roulette';

interface ResultDisplayProps {
  result: RouletteResult | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Мемоізуємо кольори конфеті
  const confettiColors = useMemo(() => {
    if (!result) return [];
    
    return result.cell.color === 'red' ? 
      ['#ef4444', '#f87171', '#fca5a5', '#fef2f2', '#ffd700'] : 
      ['#111827', '#1f2937', '#374151', '#f3f4f6', '#ffd700'];
  }, [result]);

  useEffect(() => {
    if (!result) return;

    setShowConfetti(true);
    setCountdown(3);
    
    // Відлік до наступного раунду
    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Вимикаємо конфеті через 3 секунди
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => {
      clearInterval(countdownTimer);
      clearTimeout(confettiTimer);
    };
  }, [result]);

  if (!result) return null;

  return (
    <div className="relative">
      {showConfetti && typeof window !== 'undefined' && (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
            colors={confettiColors}
          />
        </div>
      )}

      <motion.div
        key={result.cell.value}
        initial={{ scale: 0.3, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8, 
          ease: "easeOut",
          type: "spring",
          stiffness: 100
        }}
        className="text-center p-8"
      >
        <h2 className="text-white text-3xl font-bold mb-6 animate-pulse">
          🎉 WINNER! 🎉
        </h2>
        
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`
              w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white
              ${result.cell.color === 'red' ? 'bg-red-600' : 'bg-gray-800'}
              shadow-2xl border-4 border-yellow-400
            `}
          >
            {result.cell.value}
          </motion.div>
        </div>
        
        <div className="text-gray-400 text-lg">
          Next round in: <span className="text-yellow-400 font-bold">{countdown}s</span>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultDisplay;