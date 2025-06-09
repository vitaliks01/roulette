import React from 'react';
import { useRoulette } from '../../hooks/useRoulette';
import RouletteWheel from './RouletteWheel';
import Timer from './Timer';
import ResultDisplay from './ResultDisplay';
import ResultHistory from './ResultHistory';

const Roulette: React.FC = () => {
  const { cells, state, gamePhase, handleSpinComplete } = useRoulette();
  const { isSpinning, countdown, currentResult, history } = state;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-6 flex justify-center">
        <Timer countdown={countdown} gamePhase={gamePhase} />
      </div>
      
      <div className="bg-gray-800 rounded-xl p-4 shadow-lg mb-6">
        <RouletteWheel 
          cells={cells}
          spinning={isSpinning}
          onSpinComplete={handleSpinComplete}
        />
      </div>
      
      {/* Показуємо результат тільки в фазі showing_result */}
      {gamePhase === 'showing_result' && currentResult && (
        <ResultDisplay result={currentResult} />
      )}
      
      <div className="mt-6">
        <ResultHistory history={history} />
      </div>
      
      {/* Debug info - можна видалити в продакшені */}
      <div className="mt-4 text-center text-gray-500 text-xs">
        Phase: {gamePhase} | Spinning: {isSpinning ? 'Yes' : 'No'}
        {currentResult && ` | Last Result: ${currentResult.cell.value} (${currentResult.cell.color})`}
      </div>
    </div>
  );
};

export default Roulette;