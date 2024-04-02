import React, { useState, useEffect } from 'react';

const Notification = ({ message, color, showBanner, setShowBanner }) => {
  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showBanner, setShowBanner]);

  return (
    <>
      {showBanner && (
        <div className={`fixed top-0 left-0 right-0 m-3 p-4 rounded-lg text-white bg-${color}-500 z-20`}>{message}</div>
      )}
    </>
  );
};

export default Notification;
