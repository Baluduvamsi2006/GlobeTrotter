import React from 'react';
import Nav from '@/components/Nav';
import SearchFilterBar from '@/components/SearchFilterBar/SearchFilterBar';
import TripList from '@/components/Trips/TripList';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function TripsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch real trips from database for the logged-in user
  const userTrips = await prisma.trip.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      _count: {
        select: { itinerarySections: true }
      }
    },
    orderBy: {
      startDate: 'asc'
    }
  });

  // Serialize Prisma Decimals and Dates so they can be passed to the Client Component
  const serializedTrips = userTrips.map(trip => ({
    id: trip.id,
    title: trip.title,
    startDate: trip.startDate.toISOString(),
    endDate: trip.endDate.toISOString(),
    totalBudget: trip.totalBudget ? Number(trip.totalBudget) : null,
    status: trip.status,
    destinationCount: trip._count.itinerarySections,
  }));

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <Nav />
      
      <main className="container mx-auto px-4 max-w-4xl py-6">
        <div className="mb-8">
          <SearchFilterBar />
        </div>
        
        {/* Pass the real DB trips to the Client Component */}
        <TripList initialTrips={serializedTrips} />
      </main>
    </div>
  );
}
