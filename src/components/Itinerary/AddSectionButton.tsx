'use client';
import React from 'react';

interface AddSectionButtonProps {
  onClick: () => void;
}

export default function AddSectionButton({ onClick }: AddSectionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full group flex items-center justify-center gap-3 py-4 rounded-xl border-2 border-dashed border-slate-300 bg-white text-slate-600 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200"
    >
      <div className="p-1 rounded-full bg-slate-100 group-hover:bg-orange-100 transition-colors">
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <span className="font-medium text-lg">Add another Section</span>
    </button>
  );
}
