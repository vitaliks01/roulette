import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { RouletteCell, RouletteState, RouletteResult } from '../types/roulette';

// Generate cells: alternating red and black with values from 1-14
const generateCells = (): RouletteCell[] => {
  const cells: RouletteCell[] = [];
  
  for (let i = 1; i <= 14; i++) {
    cells.push({
      id: i,
      value: i,
      color: i % 2 === 0 ? 'red' : 'black'
    });
  }
  
  return cells;
};

type GamePhase = 'countdown' | 'spinning' | 'showing_result' | 'preparing_next';

export const useRoulette = () => {
  // Мемоізуємо комірки для оптимізації
  const cells = useMemo(() => generateCells(), []);
  
  const [gamePhase, setGamePhase] = useState<GamePhase>('countdown');
  const [state, setState] = useState<RouletteState>({
    isSpinning: false,
    countdown: 60,
    currentResult: null,
    history: [],
    nextAutoSpin: Date.now() + 60000
  });

  // Використовуємо ref для зберігання таймерів
  const timersRef = useRef<{
    countdownTimer?: NodeJS.Timeout;
    resultTimer?: NodeJS.Timeout;
    prepareTimer?: NodeJS.Timeout;
  }>({});

  // Функція очищення всіх таймерів
  const clearAllTimers = useCallback(() => {
    Object.values(timersRef.current).forEach(timer => {
      if (timer) clearTimeout(timer);
    });
    timersRef.current = {};
  }, []);

  // Function to handle spin completion - отримує точний результат від колеса
  const handleSpinComplete = useCallback((cell: RouletteCell) => {
    console.log('🎯 Spin completed, final result determined by wheel position:', cell.value, cell.color);
    
    const result: RouletteResult = {
      cell,
      timestamp: Date.now()
    };
    
    setState(prev => ({
      ...prev,
      isSpinning: false,
      currentResult: result,
      history: [result, ...prev.history].slice(0, 10),
    }));

    // Переходимо до фази показу результату
    setGamePhase('showing_result');
    console.log('📊 Showing result for 3 seconds...');

    // Через 3 секунди переходимо до підготовки нового циклу
    timersRef.current.resultTimer = setTimeout(() => {
      console.log('⏰ Result shown, preparing next cycle...');
      setGamePhase('preparing_next');
      
      setState(prev => ({
        ...prev,
        currentResult: null,
      }));

      // Пауза 1 секунда перед новим циклом
      timersRef.current.prepareTimer = setTimeout(() => {
        console.log('🔄 Starting new countdown cycle');
        setGamePhase('countdown');
        
        setState(prev => ({
          ...prev,
          countdown: 60,
          nextAutoSpin: Date.now() + 60000
        }));
      }, 1000);
    }, 3000);
  }, []);

  // Function to start a spin - не визначає результат заздалегідь
  const spin = useCallback(() => {
    console.log('🎰 Starting spin without predetermined result...');
    
    setGamePhase('spinning');
    setState(prev => ({
      ...prev,
      isSpinning: true,
    }));
  }, []);

  // Main timer logic - оптимізований useEffect
  useEffect(() => {
    if (gamePhase !== 'countdown') return;

    console.log('⏰ Starting countdown timer...');
    
    timersRef.current.countdownTimer = setInterval(() => {
      setState(prev => {
        const now = Date.now();
        const timeLeft = Math.max(0, Math.floor((prev.nextAutoSpin - now) / 1000));

        // Якщо час вийшов - запускаємо рулетку
        if (timeLeft === 0) {
          console.log('⏰ Countdown finished, triggering spin...');
          // Використовуємо setTimeout для уникнення конфліктів стейту
          setTimeout(() => spin(), 100);
          return prev; // Не змінюємо стейт тут
        }

        return {
          ...prev,
          countdown: timeLeft
        };
      });
    }, 1000);

    // Cleanup function
    return () => {
      if (timersRef.current.countdownTimer) {
        clearInterval(timersRef.current.countdownTimer);
        timersRef.current.countdownTimer = undefined;
      }
    };
  }, [gamePhase, spin]);

  // Cleanup effect при демонтажі компонента
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  return {
    cells,
    state,
    gamePhase,
    spin,
    handleSpinComplete
  };
};