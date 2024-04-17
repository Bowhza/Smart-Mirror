import React, { useState, useEffect } from 'react';

// Component for a hold-to-activate button
const HoldButton = ({ activationTime, onActivate, text = 'Hold to Activate' }) => {
  const [holding, setHolding] = useState(false); // State to track holding status
  const [progress, setProgress] = useState(0); // State to track progress of holding

  useEffect(() => {
    let holdTimer;

    // Function to handle hold start
    const handleHoldStart = () => {
      holdTimer = setInterval(() => {
        setProgress(prevProgress => {
          const newProgress = prevProgress + 1;
          if (newProgress === 100) {
            onActivate(); // Call onActivate function when hold completes
            setHolding(false); // Reset holding status
            return 0; // Reset progress
          }
          return newProgress; // Increment progress
        });
      }, activationTime / 100); // Calculate interval based on activation time
    };

    // Function to handle hold end
    const handleHoldEnd = () => {
      clearInterval(holdTimer); // Clear the hold timer
      setProgress(0); // Reset progress
      setHolding(false); // Reset holding status
    };

    // Start or end hold based on holding status
    if (holding) {
      handleHoldStart();
    } else {
      handleHoldEnd();
    }

    // Clean up function to clear the hold timer
    return () => {
      clearInterval(holdTimer);
    };
  }, [holding, activationTime, onActivate]);

  // Event handler for mouse down
  const handleMouseDown = () => {
    setHolding(true); // Start holding
  };

  // Event handler for mouse up
  const handleMouseUp = () => {
    setHolding(false); // End holding
  };

  // Event handler for touch start
  const handleTouchStart = () => {
    setHolding(true); // Start holding
  };

  // Event handler for touch end
  const handleTouchEnd = () => {
    setHolding(false); // End holding
  };

  // Render the hold button
  return (
    <div
      className="relative w-full h-12 bg-gradient-to-br from-rose-400 to-red-500 rounded-md overflow-hidden text-neutral-100 font-bold shadow-md"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress bar */}
      <div
        className="absolute top-0 left-0 h-full bg-gradient-to-br from-rose-500 to-red-600"
        style={{ width: `${progress}%` }}
      ></div>
      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {holding ? `${progress}%` : text} {/* Show progress or default text */}
      </span>
    </div>
  );
};

export default HoldButton;
