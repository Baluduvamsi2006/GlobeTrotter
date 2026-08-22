import React from 'react';
import Nav from '@/components/Nav';
import SearchFilterBar from '@/components/SearchFilterBar/SearchFilterBar';
import ItineraryView from '@/components/ItineraryView/ItineraryView';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function ItineraryViewPage({
  searchParams,
}: {
  searchParams: Promise<{ tripId: string }> | { tripId: string };
}) {
  const resolvedParams = await searchParams;
  const tripId = resolvedParams.tripId;

  if (!tripId) {
    return (
      <div className="min-h-screen bg-slate-100 font-sans">
        <Nav />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">No Trip Selected</h1>
          <p className="text-slate-600 mb-8">You need to select a trip before you can view its itinerary.</p>
          <Link href="/trips" className="bg-sky-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-sky-700 transition-colors">
            Go to My Trips
          </Link>
        </main>
      </div>
    );
  }

  // Fetch sections (Stops/Cities) and their nested activities
  const sections = await prisma.itinerarySection.findMany({
    where: { tripId },
    orderBy: { sortOrder: 'asc' },
    include: {
      activities: {
        orderBy: { sortOrder: 'asc' }
      }
    }
  });

  const formattedSections = sections.map(section => ({
    id: section.id,
    title: section.title,
    dateFrom: section.dateFrom ? section.dateFrom.toISOString() : null,
    dateTo: section.dateTo ? section.dateTo.toISOString() : null,
    budget: section.budget ? Number(section.budget) : 0,
    activities: section.activities.map(act => ({
      id: act.id,
      name: act.name,
      expense: act.expense ? Number(act.expense) : 0,
      time: act.startTime ? act.startTime.toISOString() : null // PDF mentioned time
    }))
  }));

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <Nav />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8 max-w-5xl mx-auto">
          {/* Top toolbar as requested in wireframe */}
          <SearchFilterBar />
        </div>
        
        {/* Main Content Area */}
        <div className="flex justify-center w-full">
          <ItineraryView sections={formattedSections} tripId={tripId} />
        </div>
      </main>
    </div>
  );
}
