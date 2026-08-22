import React from 'react';
import { Section, SectionActivity } from './ItineraryBuilder';

interface ItinerarySectionCardProps {
  section: Section;
  onUpdate: (section: Section) => void;
  onRemove: () => void;
}

export default function ItinerarySectionCard({
  section,
  onUpdate,
  onRemove,
}: ItinerarySectionCardProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate({
      ...section,
      [name]: name === 'budget' ? Number(value) : value
    });
  };

  const handleAddActivity = () => {
    const newActivity: SectionActivity = {
      id: String(Date.now()),
      name: '',
      expense: 0
    };
    onUpdate({
      ...section,
      activities: [...(section.activities || []), newActivity]
    });
  };

  const handleUpdateActivity = (id: string, field: keyof SectionActivity, value: string | number) => {
    onUpdate({
      ...section,
      activities: (section.activities || []).map(a => 
        a.id === id ? { ...a, [field]: field === 'expense' ? Number(value) : value } : a
      )
    });
  };

  const handleRemoveActivity = (id: string) => {
    onUpdate({
      ...section,
      activities: (section.activities || []).filter(a => a.id !== id)
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all duration-200 hover:shadow-md hover:border-sky-300">
      <div className="flex justify-between items-start mb-4">
        <div className="w-full pr-4">
          <input 
            type="text" 
            name="title"
            value={section.title} 
            onChange={handleChange}
            placeholder="City or Stop Name (e.g. Paris)"
            className="text-2xl font-semibold text-slate-800 w-full outline-none bg-transparent border-b border-transparent focus:border-sky-300 transition-colors"
          />
        </div>
        <button onClick={onRemove} className="text-slate-400 hover:text-rose-500 transition-colors p-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Start Date</label>
          <input 
            type="date"
            name="dateFrom"
            value={section.dateFrom?.split('T')[0] || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">End Date</label>
          <input 
            type="date"
            name="dateTo"
            value={section.dateTo?.split('T')[0] || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Budget ($)</label>
          <input 
            type="number"
            name="budget"
            value={section.budget || ''}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-slate-700">Activities</h4>
          <button 
            onClick={handleAddActivity}
            className="text-sm font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1 bg-sky-50 px-3 py-1.5 rounded-md hover:bg-sky-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Add Activity
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {(!section.activities || section.activities.length === 0) && (
            <p className="text-sm text-slate-400 italic">No activities planned yet.</p>
          )}
          {section.activities?.map(activity => (
            <div key={activity.id} className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-200">
              <input 
                type="text"
                value={activity.name}
                onChange={e => handleUpdateActivity(activity.id, 'name', e.target.value)}
                placeholder="Activity name (e.g. Louvre Museum)"
                className="flex-1 bg-white border border-slate-200 px-3 py-1.5 rounded-md text-sm outline-none focus:border-sky-400"
              />
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input 
                  type="number"
                  value={activity.expense || ''}
                  onChange={e => handleUpdateActivity(activity.id, 'expense', e.target.value)}
                  placeholder="Cost"
                  className="w-24 bg-white border border-slate-200 pl-7 pr-3 py-1.5 rounded-md text-sm outline-none focus:border-sky-400"
                />
              </div>
              <button 
                onClick={() => handleRemoveActivity(activity.id)}
                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                title="Remove activity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
