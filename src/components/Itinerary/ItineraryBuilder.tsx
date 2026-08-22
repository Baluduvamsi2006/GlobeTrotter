'use client';

import React, { useState } from 'react';
import ItinerarySectionCard from './ItinerarySectionCard';
import AddSectionButton from './AddSectionButton';
import { saveItinerarySections } from '@/app/actions/itineraryActions';

export interface SectionActivity {
  id: string;
  name: string;
  expense: number;
}

export interface Section {
  id: string;
  title: string;
  description: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  budget: number;
  activities: SectionActivity[];
}

interface ItineraryBuilderProps {
  initialSections: Section[];
  tripId: string;
}

export default function ItineraryBuilder({ initialSections, tripId }: ItineraryBuilderProps) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddStop = () => {
    const newSection: Section = {
      id: String(Date.now()), // temporary id
      title: `City/Stop ${sections.length + 1}`,
      description: '',
      dateFrom: new Date().toISOString().split('T')[0],
      dateTo: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      budget: 0.00,
      activities: []
    };
    setSections([...sections, newSection]);
  };

  const handleUpdateSection = (updatedSection: Section) => {
    setSections(sections.map(s => s.id === updatedSection.id ? updatedSection : s));
  };

  const handleRemoveSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newSections = [...sections];
      const temp = newSections[index - 1];
      newSections[index - 1] = newSections[index];
      newSections[index] = temp;
      setSections(newSections);
    } else if (direction === 'down' && index < sections.length - 1) {
      const newSections = [...sections];
      const temp = newSections[index + 1];
      newSections[index + 1] = newSections[index];
      newSections[index] = temp;
      setSections(newSections);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveItinerarySections(tripId, sections.map(s => ({
      title: s.title,
      type: s.description,
      startDate: s.dateFrom ? new Date(s.dateFrom) : null,
      endDate: s.dateTo ? new Date(s.dateTo) : null,
      budget: s.budget,
      activities: s.activities
    })));
    setIsSaving(false);
    
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Build Itinerary</h1>
          <p className="text-slate-600">Plan your trip day by day by adding stops and activities.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-sky-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-sky-700 transition-colors disabled:opacity-50 shadow-sm"
        >
          {isSaving ? 'Saving...' : 'Save Itinerary'}
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {sections.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500 italic mb-4">No stops yet. Add one to get started!</p>
            <AddSectionButton onClick={handleAddStop} />
          </div>
        )}
        
        {sections.map((section, index) => (
          <div key={section.id} className="relative">
            {/* Reorder Controls */}
            <div className="absolute -left-12 top-4 flex flex-col gap-1 hidden md:flex">
              <button 
                onClick={() => moveSection(index, 'up')}
                disabled={index === 0}
                className="p-1 text-slate-400 hover:text-sky-600 disabled:opacity-30 transition-colors bg-white rounded-full shadow-sm border border-slate-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
              </button>
              <button 
                onClick={() => moveSection(index, 'down')}
                disabled={index === sections.length - 1}
                className="p-1 text-slate-400 hover:text-sky-600 disabled:opacity-30 transition-colors bg-white rounded-full shadow-sm border border-slate-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>

            <ItinerarySectionCard
              section={section}
              onUpdate={handleUpdateSection}
              onRemove={() => handleRemoveSection(section.id)}
            />
          </div>
        ))}
      </div>

      {sections.length > 0 && (
        <div className="mt-8 flex justify-center">
          <AddSectionButton onClick={handleAddStop} />
        </div>
      )}
    </div>
  );
}
