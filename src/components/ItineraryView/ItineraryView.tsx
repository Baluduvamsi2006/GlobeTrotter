'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export interface Activity {
  id: string;
  name: string;
  expense: number;
  time?: string | null;
}

export interface SectionGroup {
  id: string;
  title: string;
  dateFrom: string | null;
  dateTo: string | null;
  budget: number;
  activities: Activity[];
}

interface ItineraryViewProps {
  sections: SectionGroup[];
  tripId: string;
}

export default function ItineraryView({ sections, tripId }: ItineraryViewProps) {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Dates TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 px-4">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
          Itinerary View
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-200 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('list')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              List
            </button>
            <button 
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'calendar' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Calendar
            </button>
          </div>
          <Link 
            href={`/build-itinerary?tripId=${tripId}`}
            className="bg-slate-800 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors shadow-sm"
          >
            Edit Itinerary
          </Link>
        </div>
      </div>

      <div className="w-full">
        {sections.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-200">
            <p className="text-slate-500 text-lg mb-4">No stops found for this trip.</p>
            <Link href={`/build-itinerary?tripId=${tripId}`} className="text-sky-600 font-medium hover:underline">
              Add stops and activities in the builder
            </Link>
          </div>
        )}

        {/* LIST VIEW */}
        {viewMode === 'list' && (
          <div className="flex flex-col gap-10">
            {sections.map((section, index) => (
              <div key={section.id} className="relative">
                {/* City Header */}
                <div className="sticky top-0 z-10 bg-slate-100/95 backdrop-blur py-4 mb-4 border-b border-slate-300 flex justify-between items-end">
                  <div>
                    <span className="text-sm font-bold tracking-widest text-sky-600 uppercase mb-1 block">Stop {index + 1}</span>
                    <h3 className="text-3xl font-extrabold text-slate-800">{section.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-600 font-medium">{formatDate(section.dateFrom)} - {formatDate(section.dateTo)}</p>
                    <p className="text-slate-500 text-sm">Budget: ${section.budget.toFixed(2)}</p>
                  </div>
                </div>

                {/* Activities Timeline */}
                <div className="pl-4 md:pl-8">
                  {section.activities.length === 0 ? (
                    <p className="text-slate-400 italic py-4">No activities planned for this stop.</p>
                  ) : (
                    <div className="flex flex-col border-l-2 border-slate-200 ml-4 relative">
                      {section.activities.map((activity, actIdx) => (
                        <div key={activity.id} className="relative pl-8 py-6 group">
                          {/* Timeline Dot */}
                          <div className="absolute w-4 h-4 bg-white border-4 border-sky-500 rounded-full -left-[9px] top-8 shadow-sm group-hover:scale-125 transition-transform" />
                          
                          {/* Activity Card */}
                          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <div>
                              <h4 className="text-lg font-bold text-slate-800">{activity.name}</h4>
                              <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {activity.time ? new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Time TBD'}
                              </p>
                            </div>
                            <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg font-semibold text-lg border border-emerald-100 flex items-center gap-1">
                              ${activity.expense.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CALENDAR VIEW (Grid layout as requested in plan) */}
        {viewMode === 'calendar' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section, index) => (
              <div key={section.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
                <div className="bg-slate-800 p-4 text-white">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-300">Stop {index + 1}</span>
                    <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">{formatDate(section.dateFrom)}</span>
                  </div>
                  <h3 className="text-xl font-bold truncate">{section.title}</h3>
                </div>
                
                <div className="p-4 flex-1 flex flex-col gap-3 bg-slate-50 overflow-y-auto max-h-96">
                  {section.activities.length === 0 ? (
                    <p className="text-slate-400 italic text-sm text-center mt-4">No activities.</p>
                  ) : (
                    section.activities.map(activity => (
                      <div key={activity.id} className="bg-white p-3 rounded border border-slate-200 shadow-sm flex justify-between items-center">
                        <div className="truncate pr-2">
                          <p className="font-semibold text-slate-700 text-sm truncate">{activity.name}</p>
                          <p className="text-xs text-slate-500">{activity.time ? 'Set Time' : 'Time TBD'}</p>
                        </div>
                        <span className="font-medium text-emerald-600 text-sm whitespace-nowrap">
                          ${activity.expense.toFixed(2)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="p-4 border-t border-slate-100 bg-white flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-500 uppercase">Stop Budget</span>
                  <span className="font-bold text-slate-800">${section.budget.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
