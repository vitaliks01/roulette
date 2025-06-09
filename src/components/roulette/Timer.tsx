import React, { useMemo } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  countdown: number;
  gamePhase?: string;
}

const Timer: React.FC<TimerProps> = ({ countdown, gamePhase }) => {
  // Мемоізуємо форматування часу
  const formattedTime = useMemo(() => {
    const mins = Math.floor(countdown / 60);
    const secs = countdown % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [countdown]);

  // Мемоізуємо відображення таймера залежно від фази гри
  const timerDisplay = useMemo(() => {
    switch (gamePhase) {
      case 'spinning':
        return {
          color: 'text-yellow-400',
          text: 'Spinning...',
          showClock: false,
          animate: 'animate-pulse'
        };
      case 'showing_result':
        return {
          color: 'text-green-400',
          text: 'Winner!',
          showClock: false,
          animate: 'animate-bounce'
        };
      case 'preparing_next':
        return {
          color: 'text-blue-400',
          text: 'Next round...',
          showClock: false,
          animate: 'animate-pulse'
        };
      default:
        return {
          color: countdown <= 10 ? 'text-red-400' : countdown <= 30 ? 'text-yellow-400' : 'text-green-400',
          text: formattedTime,
          showClock: true,
          animate: countdown <= 10 ? 'animate-pulse' : ''
        };
    }
  }, [gamePhase, countdown, formattedTime]);

  return (
    <div className="flex items-center justify-center gap-3 bg-gray-800 rounded-full px-6 py-3 text-white font-medium shadow-lg border border-gray-700">
      {timerDisplay.showClock && <Clock size={20} className={timerDisplay.color} />}
      <span className={`text-xl font-mono ${timerDisplay.color} ${timerDisplay.animate}`}>
        {timerDisplay.text}
      </span>
    </div>
  );
};

export default Timer;