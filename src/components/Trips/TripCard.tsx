'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { deleteTrip } from '@/app/actions/tripActions';
import { useRouter } from 'next/navigation';

interface TripCardProps {
  id: string;
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  totalBudget?: number | null;
  destinationCount: number;
}

export default function TripCard({ id, title, startDate, endDate, totalBudget, destinationCount }: TripCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateValue: string | Date) => {
    return new Date(dateValue).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const dateRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this trip?')) {
      setIsDeleting(true);
      const res = await deleteTrip(id);
      if (res.success) {
        // Will cause a refresh if router.refresh is used, or server action handles revalidatePath
      } else {
        alert(res.error || 'Failed to delete trip');
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-4 transition-all duration-300 hover:shadow-xl hover:border-sky-300 transform hover:-translate-y-1 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-sky-600 transition-colors truncate">{title}</h3>
        
        <div className="flex flex-wrap gap-4">
          {/* Date Range */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-100 text-sky-700">
            <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium text-sm">{dateRange}</span>
          </div>

          {/* Destinations */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-100 text-amber-700">
            <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium text-sm">{destinationCount} {destinationCount === 1 ? 'Stop' : 'Stops'}</span>
          </div>

          {/* Budget */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700">
            <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-sm">{totalBudget ? `$${Number(totalBudget).toFixed(2)}` : 'TBD'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-4 md:mt-0 flex-shrink-0">
        <Link 
          href={`/itinerary-view?tripId=${id}`}
          className="px-4 py-2.5 text-sm font-bold text-sky-700 bg-sky-50 border border-sky-200 rounded-xl hover:bg-sky-100 hover:shadow-sm active:scale-95 transition-all"
        >
          View
        </Link>
        <Link 
          href={`/build-itinerary?tripId=${id}`}
          className="px-4 py-2.5 text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 hover:shadow-sm active:scale-95 transition-all"
        >
          Edit
        </Link>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-4 py-2.5 text-sm font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 hover:shadow-sm active:scale-95 transition-all disabled:opacity-50"
        >
          {isDeleting ? '...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
