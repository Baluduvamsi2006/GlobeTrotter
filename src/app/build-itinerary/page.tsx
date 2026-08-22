import Nav from '@/components/Nav';
import ItineraryBuilder from '@/components/Itinerary/ItineraryBuilder';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function BuildItineraryPage({
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
          <p className="text-slate-600 mb-8">You need to select a trip before you can build an itinerary for it.</p>
          <Link href="/trips" className="bg-sky-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-sky-700 transition-colors">
            Go to My Trips
          </Link>
        </main>
      </div>
    );
  }

  const itinerarySections = await prisma.itinerarySection.findMany({
    where: { tripId },
    orderBy: { sortOrder: 'asc' },
  });

  // Convert dates and decimals to primitive types for Client Component
  const formattedSections = itinerarySections.map(section => ({
    id: section.id,
    title: section.title,
    description: section.description,
    dateFrom: section.dateFrom ? section.dateFrom.toISOString() : null,
    dateTo: section.dateTo ? section.dateTo.toISOString() : null,
    budget: section.budget ? Number(section.budget) : 0,
    activities: [], // Empty initially for the builder form
  }));

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <Nav />
      
      <main className="container mx-auto">
        <ItineraryBuilder initialSections={formattedSections} tripId={tripId} />
      </main>
    </div>
  );
}
