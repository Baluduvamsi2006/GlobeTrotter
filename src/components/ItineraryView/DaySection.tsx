import React from 'react';
import ActivityRow from './ActivityRow';

export interface Activity {
  id: string;
  name: string;
  expense: number;
}

interface DaySectionProps {
  dayNumber: number;
  activities: Activity[];
}

export default function DaySection({ dayNumber, activities }: DaySectionProps) {
  if (activities.length === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 w-full mb-12">
      {/* Day Badge */}
      <div className="w-24 flex-shrink-0 pt-1">
        <div className="inline-block border-2 border-slate-300 rounded-lg px-4 py-2 text-slate-800 font-semibold bg-white shadow-sm whitespace-nowrap">
          Day {dayNumber}
        </div>
      </div>

      {/* Activities Flow */}
      <div className="flex-1 flex flex-col">
        {activities.map((activity, index) => (
          <ActivityRow
            key={activity.id}
            name={activity.name}
            expense={activity.expense}
            isLast={index === activities.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
