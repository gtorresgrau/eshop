import { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
  className?: string;
}

export const Select = ({ children, className = '', ...props }: SelectProps) => {
  return (
    <select
      className={`block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 
        focus:outline-none focus:ring-blue-500 sm:text-sm ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

// Versión mejorada con Trigger y Content (como en tu ejemplo)
interface SelectAdvancedProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
}

export const SelectAdvanced = ({ value, onValueChange, children }: SelectAdvancedProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 
        focus:outline-none focus:ring-blue-500 sm:text-sm"
    >
      {children}
    </select>
  );
};

export const SelectTrigger = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white">
      {children}
    </div>
  );
};

export const SelectContent = ({ children }: { children: ReactNode }) => {
  return (
    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
      {children}
    </div>
  );
};

export const SelectItem = ({ value, children }: { value: string; children: ReactNode }) => {
  return (
    <option value={value} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
      {children}
    </option>
  );
};

export const SelectValue = ({ placeholder }: { placeholder: string }) => {
  return <span className="text-gray-500">{placeholder}</span>;
};