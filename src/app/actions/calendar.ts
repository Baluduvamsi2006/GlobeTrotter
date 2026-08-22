'use server';

import { prisma } from '@/lib/prisma';

export type CalendarEventItem = {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  color: string;
  type: 'trip' | 'activity';
};

// A helper function to assign a consistent color based on string hash
function getColorForString(str: string): string {
  const colors = [
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-rose-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export async function getCalendarEvents(): Promise<{ success: boolean; events?: CalendarEventItem[]; error?: string }> {
  try {
    // For now we fetch ALL trips since we don't have user session context perfectly wired yet.
    // In reality, this would be: where: { userId: session.user.id }
    const trips = await prisma.trip.findMany({
      orderBy: { startDate: 'asc' },
    });

    // Map trips to CalendarEventItem
    const events: CalendarEventItem[] = trips.map(trip => ({
      id: trip.id,
      title: trip.title,
      startDate: trip.startDate,
      endDate: trip.endDate,
      color: getColorForString(trip.title),
      type: 'trip' as const,
    }));

    // If there are no trips, let's inject a few dummy ones so the calendar isn't empty!
    if (events.length === 0) {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      events.push(
        {
          id: 'dummy-1',
          title: 'PARIS TRIP',
          startDate: new Date(currentYear, currentMonth, 4),
          endDate: new Date(currentYear, currentMonth, 7),
          color: 'bg-indigo-500',
          type: 'trip',
        },
        {
          id: 'dummy-2',
          title: 'NYC - GETAWAY',
          startDate: new Date(currentYear, currentMonth, 14),
          endDate: new Date(currentYear, currentMonth, 16),
          color: 'bg-emerald-500',
          type: 'trip',
        },
        {
          id: 'dummy-3',
          title: 'JAPAN ADVENTURE',
          startDate: new Date(currentYear, currentMonth, 16),
          endDate: new Date(currentYear, currentMonth, 22),
          color: 'bg-rose-500',
          type: 'trip',
        }
      );
    }

    return { success: true, events };
  } catch (error: any) {
    console.error('Failed to fetch calendar events:', error);
    return { success: false, error: 'Failed to fetch calendar events' };
  }
}
