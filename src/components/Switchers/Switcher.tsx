import { useEffect, useState } from 'react';

const Switcher = ({ id, onChange, value, disabled }: any) => {
  const [enabled, setEnabled] = useState(value || false); // Initialize state with prop value or false
  const [originalValue, setOriginalValue] = useState(value || false); // Store the original value

  const handleToggleSwitch = () => {
    const newValue = !enabled; // Calculate the new value
    setEnabled(newValue); // Update the state
    if (onChange) {
      onChange(id, newValue); // Pass the new value to the onChange callback
    }
  };
  useEffect(() => {
    setOriginalValue(value || false);
  }, [value]);

  const resetToOriginalValue = () => {
    setEnabled(originalValue); // Reset the state to the original value
  };

  return (
    <div>
      <label
        htmlFor={`toggle${id}`}
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            id={`toggle${id}`}
            className="sr-only"
            checked={enabled}
            disabled={disabled}
            onChange={handleToggleSwitch}
            onBlur={resetToOriginalValue} // Reset to original value when focus is lost
          />
          <div
            className={`block h-8 w-14 rounded-full ${
              enabled ? 'bg-secondary-color' : 'bg-slate-400'
            }`}
          ></div>
          <div
            className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
              enabled && 'right-1 translate-x-full'
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default Switcher;
