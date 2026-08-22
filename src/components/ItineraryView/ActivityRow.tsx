import React from 'react';

interface ActivityRowProps {
  name: string;
  expense: number;
  isLast: boolean;
}

export default function ActivityRow({ name, expense, isLast }: ActivityRowProps) {
  return (
    <div className="flex flex-col mb-1 relative">
      <div className="flex items-start gap-8 w-full max-w-2xl">
        {/* Physical Activity Card */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200 p-4 transition-colors hover:border-sky-300 relative z-10">
          <p className="font-medium text-slate-800">{name}</p>
        </div>

        {/* Expense Card */}
        <div className="w-32 flex-shrink-0 bg-white rounded-lg shadow-sm border border-slate-200 p-4 transition-colors hover:border-sky-300 relative z-10">
          <p className="font-medium text-slate-700 text-center">
            ${expense.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Downward Arrow Connector */}
      {!isLast && (
        <div className="flex items-start gap-8 w-full max-w-2xl">
          <div className="flex-1 flex justify-center py-2 relative z-0">
            <svg 
              className="w-5 h-5 text-slate-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <div className="w-32 flex-shrink-0" />
        </div>
      )}
    </div>
  );
}
