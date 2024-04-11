import React, { useState, useEffect } from 'react';

const HoldButton = ({ activationTime, onActivate, text = 'Hold to Activate' }) => {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let holdTimer;

    const handleHoldStart = () => {
      holdTimer = setInterval(() => {
        setProgress(prevProgress => {
          const newProgress = prevProgress + 1;
          if (newProgress === 100) {
            onActivate();
            setHolding(false);
            return 0;
          }
          return newProgress;
        });
      }, activationTime / 100);
    };

    const handleHoldEnd = () => {
      clearInterval(holdTimer);
      setProgress(0);
      setHolding(false);
    };

    if (holding) {
      handleHoldStart();
    } else {
      handleHoldEnd();
    }

    return () => {
      clearInterval(holdTimer);
    };
  }, [holding, activationTime, onActivate]);

  const handleMouseDown = () => {
    setHolding(true);
  };

  const handleMouseUp = () => {
    setHolding(false);
  };

  const handleTouchStart = () => {
    setHolding(true);
  };

  const handleTouchEnd = () => {
    setHolding(false);
  };

  return (
    <div
      className="relative w-full h-12 
      bg-gradient-to-br from-rose-400 to-red-500 rounded-md overflow-hidden text-neutral-100 font-bold shadow-md"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="absolute top-0 left-0 h-full bg-gradient-to-br from-rose-500 to-red-600"
        style={{ width: `${progress}%` }}
      ></div>
      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {holding ? `${progress}%` : text}
      </span>
    </div>
  );
};

export default HoldButton;
