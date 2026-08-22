import React from 'react';

interface ItinerarySectionCardProps {
  title: string;
  description?: string;
  dateFrom?: string;
  dateTo?: string;
  budget?: number;
}

export default function ItinerarySectionCard({
  title,
  description,
  dateFrom,
  dateTo,
  budget,
}: ItinerarySectionCardProps) {
  // Format dates safely
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const dateRange = `${formatDate(dateFrom)} - ${formatDate(dateTo)}`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 transition-all duration-200 hover:shadow-md hover:border-sky-300">
      <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
      
      {description && (
        <p className="text-slate-600 mb-6 leading-relaxed">
          {description}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Date Range Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-50 border border-sky-100 text-sky-700">
          <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-medium text-sm">Date Range: {dateRange}</span>
        </div>

        {/* Budget Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
          <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium text-sm">Budget: {budget ? `$${budget.toFixed(2)}` : 'Not Set'}</span>
        </div>
      </div>
    </div>
  );
}
