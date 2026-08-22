import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";

const defaultDestinations = [
  { city: "Lisbon", country: "Portugal", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=600&q=80" },
  { city: "Kyoto", country: "Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80" },
  { city: "Cape Town", country: "South Africa", image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=600&q=80" },
  { city: "Reykjavik", country: "Iceland", image: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=600&q=80" },
];

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;
  const userName = session?.user?.name?.split(' ')[0] || "Traveler";

  let dbTrips: any[] = [];
  let totalPlannedBudget = 0;
  let totalAllocated = 0;

  if (userId) {
    dbTrips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
      take: 3,
    });
    const allTrips = await prisma.trip.findMany({ where: { userId } });
    totalPlannedBudget = allTrips.reduce((acc, t) => acc + Number(t.totalBudget || 0), 0);
    totalAllocated = allTrips.reduce((acc, t) => acc + Number(t.actualSpend || 0), 0);
  }

  const fetchedPlaces = await prisma.place.findMany({ take: 4 });
  const destinations = fetchedPlaces.length >= 4 
    ? fetchedPlaces.map((p, i) => ({ city: p.city, country: p.country, image: p.photoUrl || defaultDestinations[i % 4].image }))
    : defaultDestinations;

  const today = format(new Date(), "EEEE, d MMMM yyyy");

  return (
    <div id="top" className="app-shell bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen font-sans">
      <Nav />
      <main className="dashboard max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <section className="welcome-row mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6" id="overview">
          <div>
            <p className="text-sky-600 font-bold text-sm tracking-wider uppercase mb-2">{today}</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Good morning, {userName} <span aria-hidden="true" className="text-orange-500">✈</span>
            </h1>
            <p className="text-slate-500 text-lg mt-3">Your next adventure is closer than you think.</p>
          </div>
          <Link href="/create-trip" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-1 active:translate-y-0">
            <span aria-hidden="true" className="text-2xl leading-none">＋</span> Plan a new trip
          </Link>
        </section>

        {/* Hero Banner with Glassmorphism */}
        <section className="hero-banner relative overflow-hidden rounded-2xl min-h-[300px] flex items-center p-8 md:p-12 shadow-xl mb-8" aria-label="Travel inspiration">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=85')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-sky-900/90 to-sky-900/40"></div>
          
          <div className="relative z-10 text-white max-w-xl backdrop-blur-md bg-white/10 p-6 md:p-8 rounded-2xl border border-white/20 shadow-2xl">
            <p className="text-sky-200 font-bold text-xs md:text-sm tracking-widest uppercase mb-4">MAKE ROOM FOR WONDER</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight tracking-tight">Where will you<br />go next?</h2>
            <a className="inline-flex items-center gap-3 px-6 py-3 border-2 border-white/80 hover:bg-white hover:text-sky-900 rounded-lg font-bold transition-colors" href="#explore">
              Explore destinations <span aria-hidden="true" className="text-xl">→</span>
            </a>
          </div>
        </section>

        {/* Search Toolbar */}
        <form className="search-toolbar flex flex-wrap gap-4 mb-12" role="search">
          <label className="search-field flex-1 min-w-[280px] flex items-center bg-white border border-slate-200 rounded-xl px-4 h-12 shadow-sm focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500 transition-all">
            <span className="search-icon text-sky-600 text-xl mr-3 transform -rotate-12" aria-hidden="true">⌕</span>
            <input type="search" placeholder="Search destinations or trips" aria-label="Search destinations or trips" className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400" />
          </label>
          <button type="button" className="filter-button flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-5 h-12 font-semibold text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">Group by <span aria-hidden="true" className="text-slate-400">⌄</span></button>
          <button type="button" className="filter-button flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-5 h-12 font-semibold text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">Filter <span aria-hidden="true" className="text-slate-400">⌄</span></button>
          <button type="button" className="filter-button flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-5 h-12 font-semibold text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">Sort by <span aria-hidden="true" className="text-slate-400">⌄</span></button>
        </form>

        {/* Recent Trips Section */}
        <section className="section-block mb-12" id="trips">
          <div className="section-heading flex justify-between items-end mb-6">
            <div>
              <p className="text-sky-600 font-bold text-xs tracking-widest uppercase mb-1">YOUR JOURNEY</p>
              <h2 className="text-2xl font-bold text-slate-800">Recent trips</h2>
            </div>
            <Link href="/trips" className="text-sky-600 font-bold text-sm hover:text-sky-700 flex items-center gap-1">
              View all <span aria-hidden="true">→</span>
            </Link>
          </div>
          
          {dbTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dbTrips.map((trip) => (
                <Link href={`/itinerary-view?tripId=${trip.id}`} key={trip.id} className="group block">
                  <article className="trip-card bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="h-44 bg-cover bg-center relative" style={{ backgroundImage: `url(${trip.coverPhotoUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80'})` }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold rounded-lg shadow-sm">
                        {trip.status}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col gap-1">
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-sky-600 transition-colors truncate">{trip.title}</h3>
                      <p className="text-slate-500 text-sm flex items-center gap-2">
                        <span aria-hidden="true" className="text-sky-500">◷</span> {format(new Date(trip.startDate), 'dd MMM yyyy')} - {format(new Date(trip.endDate), 'dd MMM yyyy')}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white/50 backdrop-blur border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
              <p className="text-slate-500 mb-4">You don't have any trips planned yet.</p>
              <Link href="/create-trip" className="inline-block px-5 py-2.5 bg-sky-100 text-sky-700 font-bold rounded-xl hover:bg-sky-200 transition-colors">Start Planning</Link>
            </div>
          )}
        </section>

        {/* Lower Grid: Explore + Budget */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 section-block" id="explore">
            <div className="section-heading flex justify-between items-end mb-6">
              <div>
                <p className="text-sky-600 font-bold text-xs tracking-widest uppercase mb-1">GET INSPIRED</p>
                <h2 className="text-2xl font-bold text-slate-800">Popular destinations</h2>
              </div>
              <a href="#explore" className="text-sky-600 font-bold text-sm hover:text-sky-700 flex items-center gap-1">
                See more <span aria-hidden="true">→</span>
              </a>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {destinations.map((destination, i) => (
                <a className="destination-card group relative block overflow-hidden rounded-xl bg-slate-900" href="#explore" key={i}>
                  <div className="h-40 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" style={{ backgroundImage: `url(${destination.image})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <h3 className="text-white font-bold text-sm truncate">{destination.city}</h3>
                    <p className="text-slate-300 text-xs truncate">{destination.country}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <aside className="budget-card lg:col-span-1 bg-white/80 backdrop-blur-lg border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-sky-600 font-bold text-xs tracking-widest uppercase mb-1">TRIP BUDGET</p>
                <h2 className="text-xl font-bold text-slate-800">Budget snapshot</h2>
              </div>
              <span className="text-slate-400 tracking-widest">•••</span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-6">
              <strong className="text-4xl font-extrabold text-slate-800 tracking-tight">${totalAllocated.toLocaleString()}</strong>
              <span className="text-slate-500 text-sm">of ${totalPlannedBudget.toLocaleString()} planned</span>
            </div>
            
            {/* CSS-based Budget Bar */}
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-3 relative">
              <div 
                className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                style={{ width: `${totalPlannedBudget > 0 ? Math.min((totalAllocated / totalPlannedBudget) * 100, 100) : 0}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm font-medium mt-auto pt-4 border-t border-slate-100">
              <span className="text-slate-500">
                {totalPlannedBudget > 0 ? Math.round((totalAllocated / totalPlannedBudget) * 100) : 0}% allocated
              </span>
              <b className={totalPlannedBudget - totalAllocated >= 0 ? "text-emerald-600" : "text-rose-600"}>
                ${Math.abs(totalPlannedBudget - totalAllocated).toLocaleString()} {totalPlannedBudget - totalAllocated >= 0 ? 'available' : 'over budget'}
              </b>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
