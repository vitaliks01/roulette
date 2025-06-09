import React, { useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RouletteCell } from '../../types/roulette';

interface RouletteWheelProps {
  cells: RouletteCell[];
  spinning: boolean;
  onSpinComplete: (cell: RouletteCell) => void;
}

const RouletteWheel: React.FC<RouletteWheelProps> = ({
  cells,
  spinning,
  onSpinComplete,
}) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const cellWidth = 80;
  const spinDataRef = useRef<{ finalPosition: number; duration: number } | null>(null);
  
  // Функція для розрахунку випадкової фінальної позиції
  const calculateRandomSpin = useCallback(() => {
    // Генеруємо випадкову кількість обертів (5-8 повних циклів)
    const minRotations = 5;
    const maxRotations = 8;
    const rotations = minRotations + Math.random() * (maxRotations - minRotations);
    
    // Випадкова позиція в межах одного циклу комірок
    const randomCellOffset = Math.random() * cells.length;
    
    // Загальна кількість комірок для прокрутки
    const totalCells = rotations * cells.length + randomCellOffset;
    
    // Розраховуємо фінальну позицію відносно центрального маркера
    // Важливо: віднімаємо половину ширини комірки для точного центрування
    const centerOffset = (window.innerWidth / 2) - (cellWidth / 2);
    const finalPosition = -(totalCells * cellWidth) + centerOffset;
    
    // Варіативна тривалість (7-9 секунд)
    const duration = 7 + Math.random() * 2;
    
    console.log('🎲 Generated random spin:', {
      rotations: rotations.toFixed(2),
      randomOffset: randomCellOffset.toFixed(2),
      finalPosition,
      duration: duration.toFixed(2)
    });
    
    return { finalPosition, duration };
  }, [cells.length, cellWidth]);

  // Функція для точного визначення комірки під маркером після зупинки
  const determineFinalCell = useCallback((finalPosition: number): RouletteCell => {
    // Отримуємо точну позицію жовтого маркера (центр екрану)
    const markerPosition = window.innerWidth / 2;
    
    // Розраховуємо позицію першої комірки після зупинки
    const firstCellLeft = finalPosition;
    
    // Знаходимо, в якій комірці знаходиться маркер
    // Використовуємо Math.floor для точного визначення без зсуву
    const cellsFromStart = Math.floor((markerPosition - firstCellLeft) / cellWidth);
    
    // Отримуємо індекс комірки в оригінальному масиві
    const cellIndex = cellsFromStart % cells.length;
    
    // Обробляємо негативні індекси
    const finalCellIndex = cellIndex < 0 ? cells.length + cellIndex : cellIndex;
    
    const finalCell = cells[finalCellIndex];
    
    // Додаткова перевірка для точності
    const cellLeftPosition = firstCellLeft + (cellsFromStart * cellWidth);
    const cellRightPosition = cellLeftPosition + cellWidth;
    const isMarkerInCell = markerPosition >= cellLeftPosition && markerPosition < cellRightPosition;
    
    console.log('🎯 Final cell determination:', {
      markerPosition,
      firstCellLeft: firstCellLeft.toFixed(2),
      cellsFromStart,
      cellIndex,
      finalCellIndex,
      finalCell: `${finalCell.value} (${finalCell.color})`,
      cellLeftPosition: cellLeftPosition.toFixed(2),
      cellRightPosition: cellRightPosition.toFixed(2),
      isMarkerInCell,
      calculationMethod: 'Math.floor for precise positioning'
    });
    
    return finalCell;
  }, [cells, cellWidth]);

  // Коли починається спін, генеруємо випадкові параметри
  if (spinning && !spinDataRef.current) {
    spinDataRef.current = calculateRandomSpin();
  }
  
  // Коли спін закінчується, очищаємо дані
  if (!spinning && spinDataRef.current) {
    spinDataRef.current = null;
  }
  
  const handleSpinComplete = () => {
    if (!spinning || !spinDataRef.current) return;
    
    const { finalPosition } = spinDataRef.current;
    
    console.log('🛑 Wheel animation completed, determining final cell...');
    
    // Визначаємо фінальну комірку на основі точної позиції зупинки
    const finalCell = determineFinalCell(finalPosition);
    
    // Затримка для візуального ефекту повної зупинки
    setTimeout(() => {
      console.log('✅ Final result confirmed:', finalCell.value, finalCell.color);
      onSpinComplete(finalCell);
    }, 200);
  };

  // Покращена анімаційна крива для реалістичного обертання
  const animationEasing = [0.25, 0.1, 0.25, 1]; // Плавне прискорення та сповільнення

  // Мемоізуємо рендер комірок для оптимізації
  const renderedCells = useMemo(() => {
    return Array.from({ length: 15 }, (_, setIndex) => 
      cells.map((cell) => (
        <div 
          key={`${setIndex}-${cell.id}`}
          className={`
            flex-shrink-0 h-full flex items-center justify-center text-lg font-bold border-r border-gray-700
            ${cell.color === 'red' ? 'bg-red-600 text-white' : 'bg-gray-800 text-white'}
            transition-all duration-200 hover:brightness-110
          `}
          style={{ width: `${cellWidth}px` }}
        >
          <span className="select-none">{cell.value}</span>
        </div>
      ))
    );
  }, [cells, cellWidth]);

  return (
    <div className="relative w-full overflow-hidden h-20 mx-auto bg-gray-900 rounded-lg border border-gray-700">
      {/* Точний центральний маркер */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-0 h-full w-1 bg-yellow-400 z-20 shadow-lg"></div>
      <div className="absolute left-1/2 transform -translate-x-1/2 -top-3 w-0 h-0 border-l-6 border-r-6 border-b-12 border-transparent border-b-yellow-400 z-20 drop-shadow-lg"></div>
      
      {/* Індикатор обертання */}
      {spinning && (
        <div className="absolute top-2 right-2 text-yellow-400 text-sm font-medium animate-pulse z-20">
          Spinning...
        </div>
      )}
      
      {/* Інформація про спін для налагодження */}
      {spinning && spinDataRef.current && (
        <div className="absolute top-2 left-2 text-blue-400 text-xs font-medium z-20">
          Duration: {spinDataRef.current.duration.toFixed(1)}s
        </div>
      )}
      
      {/* Показуємо точну позицію маркера для налагодження */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-yellow-300 text-xs z-20">
        Marker: {(window.innerWidth / 2).toFixed(0)}px
      </div>
      
      <motion.div
        ref={wheelRef}
        className="flex absolute left-0 top-0 h-full"
        animate={{
          x: spinning && spinDataRef.current ? spinDataRef.current.finalPosition : 0
        }}
        initial={{ x: 0 }}
        transition={{
          duration: spinning && spinDataRef.current ? spinDataRef.current.duration : 0,
          ease: animationEasing,
        }}
        onAnimationComplete={handleSpinComplete}
      >
        {renderedCells}
      </motion.div>
    </div>
  );
};

export default RouletteWheel;