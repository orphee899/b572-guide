import React, { useState } from 'react';
import { ChevronDown, ChevronUp, LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  defaultOpen?: boolean;
  warning?: boolean;
}

export const CollapsibleSection: React.FC<Props> = ({ 
  title, 
  icon: Icon, 
  children, 
  defaultOpen = false,
  warning = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`mb-4 bg-white rounded-xl shadow-sm border overflow-hidden ${warning ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-200'}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${
          warning ? 'bg-red-50 hover:bg-red-100' : 'bg-white hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${warning ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-edf-blue'}`}>
            <Icon size={20} />
          </div>
          <span className={`font-bold text-lg ${warning ? 'text-red-700' : 'text-gray-800'}`}>
            {title}
          </span>
        </div>
        {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
      </button>
      
      {isOpen && (
        <div className="px-5 py-6 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
};