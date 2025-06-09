import React from 'react';
import { RouletteResult } from '../../types/roulette';

interface ResultHistoryProps {
  history: RouletteResult[];
}

const ResultHistory: React.FC<ResultHistoryProps> = ({ history }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-gray-400 text-sm font-medium mb-2">Previous Results</h3>
      <div className="flex flex-wrap gap-2">
        {history.map((result, index) => (
          <div 
            key={index}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white
              ${result.cell.color === 'red' ? 'bg-red-600' : 'bg-gray-900'}
            `}
          >
            {result.cell.value}
          </div>
        ))}
        {history.length === 0 && (
          <div className="text-gray-500 text-sm">No previous results</div>
        )}
      </div>
    </div>
  );
};

export default ResultHistory;