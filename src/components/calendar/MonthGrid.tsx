import React from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  format
} from 'date-fns';
import { CalendarEventItem } from '@/app/actions/calendar';

interface MonthGridProps {
  currentMonth: Date;
  events: CalendarEventItem[];
}

export default function MonthGrid({ currentMonth, events }: MonthGridProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const dateFormat = "d";
  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Chunk days into weeks (7 days each)
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="w-full mt-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
      {/* Header Row */}
      <div className="grid grid-cols-7 bg-slate-50/80 backdrop-blur border-b border-slate-200">
        {weekDays.map((day) => (
          <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid (Week by Week) */}
      <div className="flex flex-col">
        {weeks.map((week, weekIdx) => {
          const weekStart = week[0];
          const weekEnd = week[6];

          // Find events that intersect this week
          const weekEvents = events.filter(event => {
            const evStart = new Date(event.startDate);
            const evEnd = new Date(event.endDate);
            // Overlaps if event start is before week end AND event end is after week start
            // Set time boundaries appropriately to ensure inclusive bounds
            const wStart = new Date(weekStart.setHours(0,0,0,0));
            const wEnd = new Date(weekEnd.setHours(23,59,59,999));
            return evStart <= wEnd && evEnd >= wStart;
          });

          // Sort events so longer ones or earlier ones process first (for prettier packing)
          weekEvents.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

          // Assign rows to prevent overlap
          const eventRows: { colStart: number, colEnd: number }[][] = [];
          
          const positionedEvents = weekEvents.map(event => {
            const evStart = new Date(event.startDate);
            const evEnd = new Date(event.endDate);

            const startDayIndex = week.findIndex(day => isSameDay(day, evStart));
            const endDayIndex = week.findIndex(day => isSameDay(day, evEnd));
            
            // If it starts before this week, it spans from column 1
            const colStart = startDayIndex >= 0 ? startDayIndex + 1 : 1;
            // If it ends after this week, it spans to column 8 (exclusive in grid)
            const colEnd = endDayIndex >= 0 ? endDayIndex + 2 : 8; 

            // Find first available row
            let rowIndex = 0;
            while (true) {
              if (!eventRows[rowIndex]) {
                eventRows[rowIndex] = [];
              }
              const overlapping = eventRows[rowIndex].some(e => {
                return (colStart < e.colEnd && colEnd > e.colStart); // Strict intersection
              });
              if (!overlapping) {
                eventRows[rowIndex].push({ colStart, colEnd });
                break;
              }
              rowIndex++;
            }
            
            return { event, colStart, colEnd, rowIndex, startDayIndex, endDayIndex };
          });

          // Calculate height of week row based on max event rows
          const maxRows = Math.max(0, ...positionedEvents.map(e => e.rowIndex));
          // Base height + room for events
          const rowHeightClass = Math.max(120, 40 + (maxRows + 1) * 28); 

          return (
            <div key={weekIdx} className="relative border-b border-gray-200 last:border-0" style={{ minHeight: `${rowHeightClass}px` }}>
              
              {/* Event overlay */}
              <div 
                className="absolute left-0 right-0 grid grid-cols-7 gap-y-1 pointer-events-none z-0"
                style={{ top: '32px' }} // Start below the date numbers
              >
                {positionedEvents.map(({ event, colStart, colEnd, rowIndex, startDayIndex, endDayIndex }) => {
                  const isStart = startDayIndex >= 0;
                  const isEnd = endDayIndex >= 0;
                  
                  return (
                    <div 
                      key={`${event.id}-${weekIdx}`}
                      style={{ 
                        gridColumnStart: colStart, 
                        gridColumnEnd: colEnd, 
                        gridRowStart: rowIndex + 1, // This fixes the overlap by placing them in separate rows!
                        height: '48px' // "half box full" - a thicker bar that takes up a good chunk of the cell
                      }}
                      className={`
                        flex items-center text-sm font-bold text-white px-3 py-1 truncate pointer-events-auto shadow-md backdrop-blur-sm bg-opacity-90 hover:scale-[1.02] hover:shadow-lg transition-all
                        ${event.color}
                        ${isStart ? 'rounded-l-xl ml-1' : ''} 
                        ${isEnd ? 'rounded-r-xl mr-1' : ''}
                        ${!isStart && !isEnd ? 'rounded-none' : ''}
                      `}
                      title={event.title}
                    >
                      {/* Show title if it's the start of the event, or if it's Sunday (colStart === 1) */}
                      {isStart || colStart === 1 ? event.title : '\u00A0'}
                    </div>
                  );
                })}
              </div>

              {/* Day cells (Numbers on top) */}
              <div className="absolute inset-0 grid grid-cols-7 pointer-events-none z-10">
                {week.map((day, i) => {
                  const isCurrentMonth = isSameMonth(day, monthStart);
                  return (
                    <div 
                      key={day.toString()} 
                      className={`
                        p-2 border-r border-gray-100 last:border-r-0
                        ${!isCurrentMonth ? 'bg-gray-50/80 text-gray-400' : 'text-gray-900'}
                      `}
                    >
                      <div className="font-medium text-sm mb-1 drop-shadow-sm bg-white/50 w-fit px-1 rounded">{format(day, dateFormat)}</div>
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
