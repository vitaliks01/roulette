import React from 'react';
import Roulette from './components/roulette/Roulette';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-start py-10">
      <header className="w-full max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Clash Roulette</h1>
        <p className="text-gray-400">Spin the wheel every minute for a chance to win!</p>
      </header>
      
      <main className="w-full">
        <Roulette />
      </main>
      
      <footer className="mt-auto pt-8 pb-4 text-center text-gray-500 text-sm">
        <p>Inspired by clash.gg/double</p>
      </footer>
    </div>
  );
}

export default App;