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
        <div className="text-center py-16 px-6 bg-gradient-to-b from-sky-50 to-white border border-sky-100 rounded-3xl shadow-sm max-w-2xl mx-auto mt-8">
          <div className="w-20 h-20 bg-sky-100 text-sky-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            ✈
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">No trips planned yet</h3>
          <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">It's a big world out there. Start building your next adventure today.</p>
          <a href="/create-trip" className="inline-flex items-center gap-2 bg-sky-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-sky-600/30 hover:bg-sky-700 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <span className="text-xl leading-none">＋</span> Create your first Trip
          </a>
        </div>
      )}
    </div>
  );
}
