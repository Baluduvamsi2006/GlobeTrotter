import React from 'react';
import { getCalendarEvents } from '@/app/actions/calendar';
import CalendarView from '@/components/calendar/CalendarView';

export const metadata = {
  title: 'Calendar | GlobeTrotter',
  description: 'View your upcoming trips and events in a calendar format.',
};

export default async function CalendarPage() {
  const result = await getCalendarEvents();
  const initialEvents = result.success && result.events ? result.events : [];

  return (
    <main className="min-h-screen bg-[#F7F9FA] py-10 px-4 sm:px-6 lg:px-8">
      <CalendarView initialEvents={initialEvents} />
    </main>
  );
}
