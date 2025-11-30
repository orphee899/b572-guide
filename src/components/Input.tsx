import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

interface HelpProps {
  guidePoint?: string;
  guideText?: string;
}

const HelpToggle: React.FC<HelpProps> = ({ guidePoint, guideText }) => {
  const [show, setShow] = useState(false);

  if (!guidePoint && !guideText) return null;

  return (
    <div className="ml-2 inline-block">
      <button
        type="button"
        onClick={() => setShow(!show)}
        className={`p-1 rounded-full transition-colors ${show ? 'bg-edf-blue text-white' : 'text-edf-blue hover:bg-blue-50'}`}
        title="Voir le requis normatif"
      >
        {show ? <X size={14} /> : <Info size={16} />}
      </button>
      {show && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 shadow-sm animate-in fade-in slide-in-from-top-1">
          {guidePoint && <span className="block font-bold mb-1 text-edf-blue">{guidePoint}</span>}
          <div className="leading-relaxed opacity-90">{guideText}</div>
        </div>
      )}
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, HelpProps {
  label: string;
  helperText?: string;
  error?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, helperText, error, className, guidePoint, guideText, ...props }) => {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      <div className="flex items-center mb-1">
        <label className="text-sm font-semibold text-gray-700">
          {label}
        </label>
        <HelpToggle guidePoint={guidePoint} guideText={guideText} />
      </div>
      
      <input
        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${
          error 
            ? 'border-red-500 focus:ring-red-200 bg-red-50' 
            : 'border-gray-300 focus:border-edf-blue focus:ring-blue-100'
        }`}
        {...props}
      />
      {helperText && (
        <span className={`text-xs mt-1 ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {helperText}
        </span>
      )}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, HelpProps {
  label: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, guidePoint, guideText, ...props }) => {
  return (
    <div className="flex flex-col mb-4">
       <div className="flex items-center mb-1">
        <label className="text-sm font-semibold text-gray-700">
          {label}
        </label>
        <HelpToggle guidePoint={guidePoint} guideText={guideText} />
      </div>
      <select
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-edf-blue focus:ring-2 focus:ring-blue-100 focus:outline-none bg-white"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};