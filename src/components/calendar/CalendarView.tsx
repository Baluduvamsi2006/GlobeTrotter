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
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
            <Layers size={16} />
            Group by
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
            <Filter size={16} />
            Filter
          </button>
          
          <div className="relative shadow-sm">
            <select
              className="appearance-none flex items-center gap-2 pl-9 pr-8 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
            </select>
            <ArrowDownUp size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
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
