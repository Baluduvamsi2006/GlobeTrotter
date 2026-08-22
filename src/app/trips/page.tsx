import React from 'react';
import Nav from '@/components/Nav';
import SearchFilterBar from '@/components/SearchFilterBar/SearchFilterBar';
import TripList from '@/components/Trips/TripList';

export default function TripsPage() {
  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <Nav />
      
      <main className="container mx-auto px-4 max-w-4xl py-6">
        <div className="mb-8">
          {/* Note: The wireframe doesn't explicitly show a page title, but normally we'd have one. 
              The SearchFilterBar matches the wireframe's sub-header perfectly. */}
          <SearchFilterBar />
        </div>
        
        <TripList />
      </main>
    </div>
  );
}
