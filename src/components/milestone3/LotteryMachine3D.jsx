import React, { useState } from 'react';

const LotteryMachine3D = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentNumber, setCurrentNumber] = useState('0000');

  const startSpin = () => {
    setIsSpinning(true);
    
    // Simulate spinning animation
    const interval = setInterval(() => {
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      setCurrentNumber(random);
    }, 100);

    // Stop after 3 seconds
    setTimeout(() => {
      clearInterval(interval);
      setIsSpinning(false);
      const finalNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      setCurrentNumber(finalNumber);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* 3D Lottery Machine Visual */}
      <div className="relative w-64 h-64 mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute inset-4 bg-white rounded-full shadow-2xl flex items-center justify-center border-8 border-blue-500">
          <div className={`text-5xl font-bold ${isSpinning ? 'animate-bounce' : ''}`}>
            {currentNumber}
          </div>
        </div>
        {/* Lottery balls animation */}
        {isSpinning && (
          <>
            <div className="absolute top-10 left-10 w-8 h-8 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-10 right-10 w-8 h-8 bg-red-400 rounded-full animate-ping delay-100"></div>
            <div className="absolute top-20 right-12 w-8 h-8 bg-green-400 rounded-full animate-ping delay-200"></div>
          </>
        )}
      </div>

      <button
        onClick={startSpin}
        disabled={isSpinning}
        className={`px-8 py-3 rounded-lg font-bold text-white transition ${
          isSpinning
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isSpinning ? 'Drawing...' : 'Start Draw'}
      </button>
    </div>
  );
};

export default LotteryMachine3D;