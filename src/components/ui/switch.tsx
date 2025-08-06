import { useState } from 'react';

interface SwitchProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export const Switch = ({ id, checked, onCheckedChange, className = '' }: SwitchProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  const toggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onCheckedChange(newValue);
  };

  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={isChecked}
      onClick={toggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
        ${isChecked ? 'bg-blue-600' : 'bg-gray-200'} ${className}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform 
          ${isChecked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );
};