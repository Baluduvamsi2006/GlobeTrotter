'use client';

import React, { useReducer, useState } from 'react';
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

interface BudgetSummary {
  total: number;
  averagePerDay: number;
  overBudgetSections: Section[];
}

function budgetReducer(_: BudgetSummary, sections: Section[]): BudgetSummary {
  const total = sections.reduce((sum, section) => sum + section.activities.reduce((activitySum, activity) => activitySum + activity.expense, 0), 0);
  const days = sections.reduce((sum, section) => {
    if (!section.dateFrom || !section.dateTo) return sum;
    return sum + Math.max(1, Math.ceil((new Date(section.dateTo).getTime() - new Date(section.dateFrom).getTime()) / 86400000));
  }, 0);
  return {
    total,
    averagePerDay: days ? total / days : 0,
    overBudgetSections: sections.filter((section) => section.activities.reduce((sum, activity) => sum + activity.expense, 0) > section.budget),
  };
}

export default function ItineraryBuilder({ initialSections, tripId }: ItineraryBuilderProps) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [isSaving, setIsSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(initialSections.length > 0 ? initialSections[0].id : null);
  const [budgetSummary, recalculateBudget] = useReducer(budgetReducer, sections, (initialSections) => budgetReducer({ total: 0, averagePerDay: 0, overBudgetSections: [] }, initialSections));

  const updateSections = (nextSections: Section[]) => {
    setSections(nextSections);
    recalculateBudget(nextSections);
  };

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
    updateSections([...sections, newSection]);
    setSelectedSectionId(newSection.id);
  };

  const handleUpdateSection = (updatedSection: Section) => {
    updateSections(sections.map(s => s.id === updatedSection.id ? updatedSection : s));
  };

  const handleRemoveSection = (id: string) => {
    updateSections(sections.filter(s => s.id !== id));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newSections = [...sections];
      const temp = newSections[index - 1];
      newSections[index - 1] = newSections[index];
      newSections[index] = temp;
      updateSections(newSections);
    } else if (direction === 'down' && index < sections.length - 1) {
      const newSections = [...sections];
      const temp = newSections[index + 1];
      newSections[index + 1] = newSections[index];
      newSections[index] = temp;
      updateSections(newSections);
    }
  };

  const dropSection = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    const nextSections = [...sections];
    const [moved] = nextSections.splice(draggedIndex, 1);
    nextSections.splice(targetIndex, 0, moved);
    updateSections(nextSections);
    setDraggedIndex(null);
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
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/80 backdrop-blur rounded-xl border border-slate-200 p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Estimated activities</p><p className="text-3xl font-extrabold text-slate-800 mt-2">${budgetSummary.total.toFixed(2)}</p></div>
        <div className="bg-white/80 backdrop-blur rounded-xl border border-slate-200 p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Average per day</p><p className="text-3xl font-extrabold text-slate-800 mt-2">${budgetSummary.averagePerDay.toFixed(2)}</p></div>
        <div className={`backdrop-blur rounded-xl border p-5 shadow-sm ${budgetSummary.overBudgetSections.length ? 'border-rose-200 bg-rose-50/80' : 'border-emerald-200 bg-emerald-50/80'}`}><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Budget status</p><p className={`text-xl font-bold mt-2 ${budgetSummary.overBudgetSections.length ? 'text-rose-700' : 'text-emerald-700'}`}>{budgetSummary.overBudgetSections.length ? `${budgetSummary.overBudgetSections.length} stop(s) over budget` : 'Within budget'}</p></div>
      </div>

      {sections.length === 0 ? (
        <div className="text-center py-16 bg-white/50 backdrop-blur rounded-2xl border border-dashed border-slate-300 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg></div>
          <p className="text-slate-500 text-lg mb-6">No stops yet. Add one to get started!</p>
          <AddSectionButton onClick={handleAddStop} />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / Tabs */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-2">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Your Stops</h3>
            <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              {sections.map((section, index) => (
                <div 
                  key={section.id} 
                  className={`relative flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all flex-shrink-0 md:flex-shrink w-48 md:w-full ${selectedSectionId === section.id ? 'bg-sky-50 border-sky-300 shadow-sm' : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-slate-50'} ${draggedIndex === index ? 'opacity-50' : ''}`}
                  onClick={() => setSelectedSectionId(section.id)}
                  draggable 
                  onDragStart={() => setDraggedIndex(index)} 
                  onDragOver={(event) => event.preventDefault()} 
                  onDrop={() => dropSection(index)} 
                  onDragEnd={() => setDraggedIndex(null)}
                >
                  <div className="truncate">
                    <div className="text-xs font-bold text-sky-600 mb-0.5">Stop {index + 1}</div>
                    <div className="font-semibold text-slate-800 truncate">{section.title}</div>
                  </div>
                  {/* Reorder Controls (Desktop only) */}
                  <div className="hidden md:flex flex-col gap-1 absolute -right-3">
                    <button onClick={(e) => { e.stopPropagation(); moveSection(index, 'up'); }} disabled={index === 0} className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-400 hover:text-sky-600 disabled:opacity-30 shadow-sm"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg></button>
                    <button onClick={(e) => { e.stopPropagation(); moveSection(index, 'down'); }} disabled={index === sections.length - 1} className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-400 hover:text-sky-600 disabled:opacity-30 shadow-sm"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 md:mt-4">
              <AddSectionButton onClick={handleAddStop} />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            {sections.filter(s => s.id === selectedSectionId).map(section => (
              <ItinerarySectionCard
                key={section.id}
                section={section}
                onUpdate={handleUpdateSection}
                onRemove={() => {
                  handleRemoveSection(section.id);
                  if (sections.length > 1) {
                    const newId = sections.find(s => s.id !== section.id)?.id;
                    if (newId) setSelectedSectionId(newId);
                  } else {
                    setSelectedSectionId(null);
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
