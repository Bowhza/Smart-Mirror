import { useState } from 'react';

// Component for a slider input
export default function Slider({ defaultValue, sliderFunction, min = 1, max = 100, percent = true }) {
  const [value, setValue] = useState(defaultValue); // State for slider value

  // Function to handle slider value change
  const handleChange = e => {
    setValue(e.target.value); // Update slider value
  };

  // Function to handle slider release
  const onRelease = e => {
    sliderFunction(value); // Call slider function with current value
  };

  return (
    <div className="flex flex-col items-center p-3">
      <div className="w-full">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          onTouchEnd={onRelease} // Call onRelease when touch ends
          className="appearance-none shadow-md bg-neutral-300 border-2 border-neutral-300 h-3 w-full rounded-full outline-none"
        />
        <div className="-mt-1 flex w-full justify-between">
          <span className="font-bold text-lg">
            {min}
            {percent && '%'}
          </span>
          <span className="font-bold text-lg">
            Current Value: {value}
            {percent && '%'}
          </span>
          <span className="font-bold text-lg">
            {max}
            {percent && '%'}
          </span>
        </div>
      </div>
    </div>
  );
}
