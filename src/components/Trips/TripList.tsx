'use client';
import React from 'react';
import TripCard from './TripCard';

// Matches the Prisma schema Trip
interface MockTrip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  status: 'ongoing' | 'upcoming' | 'completed';
}

const MOCK_TRIPS: MockTrip[] = [
  {
    id: '1',
    title: 'Summer in Tokyo',
    startDate: '2026-08-01T10:00:00.000Z',
    endDate: '2026-08-30T10:00:00.000Z',
    totalBudget: 4500,
    status: 'ongoing'
  },
  {
    id: '2',
    title: 'Backpacking across Europe',
    startDate: '2026-09-15T10:00:00.000Z',
    endDate: '2026-10-15T10:00:00.000Z',
    totalBudget: 6000,
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Weekend in New York',
    startDate: '2026-11-20T10:00:00.000Z',
    endDate: '2026-11-23T10:00:00.000Z',
    totalBudget: 1200,
    status: 'upcoming'
  },
  {
    id: '4',
    title: 'Spring Break in Cancun',
    startDate: '2026-03-10T10:00:00.000Z',
    endDate: '2026-03-17T10:00:00.000Z',
    totalBudget: 2500,
    status: 'completed'
  },
  {
    id: '5',
    title: 'Business Trip to London',
    startDate: '2026-01-15T10:00:00.000Z',
    endDate: '2026-01-20T10:00:00.000Z',
    totalBudget: 3000,
    status: 'completed'
  }
];

export default function TripList() {
  const ongoingTrips = MOCK_TRIPS.filter(trip => trip.status === 'ongoing');
  const upcomingTrips = MOCK_TRIPS.filter(trip => trip.status === 'upcoming');
  const completedTrips = MOCK_TRIPS.filter(trip => trip.status === 'completed');

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Ongoing Section */}
      {ongoingTrips.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Ongoing</h2>
          <div className="flex flex-col gap-2">
            {ongoingTrips.map(trip => (
              <TripCard 
                key={trip.id}
                title={trip.title}
                startDate={trip.startDate}
                endDate={trip.endDate}
                totalBudget={trip.totalBudget}
              />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Section */}
      {upcomingTrips.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Up-coming</h2>
          <div className="flex flex-col gap-2">
            {upcomingTrips.map(trip => (
              <TripCard 
                key={trip.id}
                title={trip.title}
                startDate={trip.startDate}
                endDate={trip.endDate}
                totalBudget={trip.totalBudget}
              />
            ))}
          </div>
        </section>
      )}

      {/* Completed Section */}
      {completedTrips.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Completed</h2>
          <div className="flex flex-col gap-2">
            {completedTrips.map(trip => (
              <TripCard 
                key={trip.id}
                title={trip.title}
                startDate={trip.startDate}
                endDate={trip.endDate}
                totalBudget={trip.totalBudget}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
