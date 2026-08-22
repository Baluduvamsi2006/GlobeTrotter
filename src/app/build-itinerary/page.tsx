import Nav from '@/components/Nav';
import ItineraryBuilder from '@/components/Itinerary/ItineraryBuilder';

export default function BuildItineraryPage() {
  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <Nav />
      
      <main className="container mx-auto">
        <ItineraryBuilder />
      </main>
    </div>
  );
}
