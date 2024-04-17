import React, { useEffect } from 'react';

// Component for displaying notifications
const Notification = ({ message, color, showBanner, setShowBanner }) => {
  useEffect(() => {
    // Automatically hide the notification after 5 seconds if showBanner is true
    if (showBanner) {
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 5000);
      return () => clearTimeout(timer); // Clean up the timer on unmount or when showBanner changes
    }
  }, [showBanner, setShowBanner]); // Re-run the effect when showBanner changes

  return (
    <>
      {showBanner && (
        // Render the notification banner if showBanner is true
        <div className={`fixed top-0 left-0 right-0 m-3 p-4 rounded-lg text-white bg-${color}-500 z-20`}>{message}</div>
      )}
    </>
  );
};

export default Notification;
