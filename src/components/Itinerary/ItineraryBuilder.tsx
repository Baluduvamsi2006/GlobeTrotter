'use client';

import React, { useState } from 'react';
import ItinerarySectionCard from './ItinerarySectionCard';
import AddSectionButton from './AddSectionButton';

// Matches the Prisma schema for ItinerarySection broadly
interface MockSection {
  id: string;
  title: string;
  description: string;
  dateFrom: string;
  dateTo: string;
  budget: number;
}

const INITIAL_SECTIONS: MockSection[] = [
  {
    id: '1',
    title: 'Section 1: Flights & Arrival',
    description: 'Flight to destination, airport transfer, and checking into the hotel.',
    dateFrom: '2026-09-01T10:00:00.000Z',
    dateTo: '2026-09-01T18:00:00.000Z',
    budget: 850.00,
  },
  {
    id: '2',
    title: 'Section 2: City Exploration',
    description: 'Guided tour of the historical downtown and lunch at the famous plaza.',
    dateFrom: '2026-09-02T09:00:00.000Z',
    dateTo: '2026-09-02T15:00:00.000Z',
    budget: 120.00,
  },
  {
    id: '3',
    title: 'Section 3: Museum Day',
    description: 'Visiting the national art museum and surrounding parks.',
    dateFrom: '2026-09-03T10:00:00.000Z',
    dateTo: '2026-09-03T14:00:00.000Z',
    budget: 45.00,
  }
];

export default function ItineraryBuilder() {
  const [sections, setSections] = useState<MockSection[]>(INITIAL_SECTIONS);

  const handleAddSection = () => {
    const newSectionId = String(sections.length + 1);
    
    // Create a generic new section
    const newSection: MockSection = {
      id: newSectionId,
      title: `Section ${newSectionId}: New Activity`,
      description: 'Add details about this new itinerary section here...',
      dateFrom: new Date().toISOString(),
      dateTo: new Date(Date.now() + 86400000).toISOString(), // +1 day
      budget: 0.00,
    };
    
    setSections([...sections, newSection]);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Build Itinerary</h1>
        <p className="text-slate-600">Plan your trip day by day with flexible sections.</p>
      </div>

      <div className="flex flex-col gap-2">
        {sections.map((section) => (
          <ItinerarySectionCard
            key={section.id}
            title={section.title}
            description={section.description}
            dateFrom={section.dateFrom}
            dateTo={section.dateTo}
            budget={section.budget}
          />
        ))}
      </div>

      <div className="mt-4">
        <AddSectionButton onClick={handleAddSection} />
      </div>
    </div>
  );
}
