'use client';
import React from 'react';
import TripCard from './TripCard';

// Using Prisma's types conceptually, or defining a simple interface based on what we fetched
interface Trip {
  id: string;
  title: string;
  startDate: Date | string;
  endDate: Date | string;
  totalBudget: any; // Prisma Decimal
  status: string;
  destinationCount: number;
}

interface TripListProps {
  initialTrips: Trip[];
}

export default function TripList({ initialTrips }: TripListProps) {
  const ongoingTrips = initialTrips.filter(trip => trip.status === 'ongoing');
  const upcomingTrips = initialTrips.filter(trip => trip.status === 'upcoming');
  const completedTrips = initialTrips.filter(trip => trip.status === 'completed');

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
                id={trip.id}
                title={trip.title}
                startDate={trip.startDate}
                endDate={trip.endDate}
                totalBudget={trip.totalBudget}
                destinationCount={trip.destinationCount}
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
                id={trip.id}
                title={trip.title}
                startDate={trip.startDate}
                endDate={trip.endDate}
                totalBudget={trip.totalBudget}
                destinationCount={trip.destinationCount}
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
                id={trip.id}
                title={trip.title}
                startDate={trip.startDate}
                endDate={trip.endDate}
                totalBudget={trip.totalBudget}
                destinationCount={trip.destinationCount}
              />
            ))}
          </div>
        </section>
      )}

      {initialTrips.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg mb-4">You have no trips yet.</p>
          <a href="/create-trip" className="inline-block bg-sky-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-sky-700 transition-colors">
            Create your first Trip
          </a>
        </div>
      )}
    </div>
  );
}
