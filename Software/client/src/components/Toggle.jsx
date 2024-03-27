import React from 'react';

const Toggle = ({ isOn, handleToggle }) => {
  return (
    <div className="relative inline-block w-12 align-middle select-none">
      <input
        type="checkbox"
        checked={isOn}
        onChange={handleToggle}
        className="toggle-checkbox absolute block size-7 appearance-none cursor-pointer"
        id="toggle"
      />
      <label
        htmlFor="toggle"
        className={`toggle-label block overflow-hidden h-6 rounded-full shadow-md cursor-pointer ${
          isOn ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        <span
          className={`block size-6 rounded-full bg-white border-4  shadow-md transform transition-transform ${
            isOn ? 'translate-x-full' : 'translate-x-0'
          }`}
        />
      </label>
    </div>
  );
};

export default Toggle;
