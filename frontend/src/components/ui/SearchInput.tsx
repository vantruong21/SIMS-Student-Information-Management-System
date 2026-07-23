import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  containerClassName?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Search...",
  containerClassName = "",
  className = "",
  ...props 
}) => {
  return (
    <div className={`relative ${containerClassName}`}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input 
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`pl-10 pr-4 py-2 rounded-full border border-gray-200/60 bg-white/70 focus:bg-white text-xs shadow-inner outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50 transition-all duration-300 placeholder:text-gray-400 font-semibold ${className}`}
        {...props}
      />
    </div>
  );
};
