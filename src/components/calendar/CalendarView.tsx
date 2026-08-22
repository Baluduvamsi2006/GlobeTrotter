'use client';

import React, { useState } from 'react';
import { Search, Filter, Layers, ArrowDownUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { addMonths, subMonths, format } from 'date-fns';
import { CalendarEventItem } from '@/app/actions/calendar';
import MonthGrid from './MonthGrid';

interface CalendarViewProps {
  initialEvents: CalendarEventItem[];
}

export default function CalendarView({ initialEvents }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [search, setSearch] = useState('');

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Client-side filtering just for immediate feedback on the search bar
  const filteredEvents = initialEvents.filter(event => 
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      {/* Top Header / Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500" size={20} />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white/70 backdrop-blur shadow-sm transition-all text-slate-800 placeholder-slate-400 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-3">
          <button className="flex-1 sm:flex-none items-center justify-center flex gap-2 px-5 py-3 bg-white/70 backdrop-blur border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 shadow-sm hover:bg-white hover:shadow-md transition-all">
            <Layers size={18} className="text-sky-500" />
            Group by
          </button>
          <button className="flex-1 sm:flex-none items-center justify-center flex gap-2 px-5 py-3 bg-white/70 backdrop-blur border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 shadow-sm hover:bg-white hover:shadow-md transition-all">
            <Filter size={18} className="text-sky-500" />
            Filter
          </button>
          
          <div className="relative shadow-sm flex-1 sm:flex-none">
            <select
              className="w-full appearance-none flex items-center gap-2 pl-10 pr-8 py-3 bg-white/70 backdrop-blur border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-white hover:shadow-md transition-all cursor-pointer outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
            </select>
            <ArrowDownUp size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="flex flex-col items-center w-full">
        <h2 className="text-xl font-medium text-gray-600 mb-6">Calendar View</h2>
        
        {/* Month Navigation */}
        <div className="flex items-center justify-between w-full max-w-sm mb-4">
          <button 
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h1>
          
          <button 
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Grid Component */}
        <MonthGrid currentMonth={currentMonth} events={filteredEvents} />
      </div>
    </div>
  );
}
