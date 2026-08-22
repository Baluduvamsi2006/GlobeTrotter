'use client';

import React, { useActionState, useState, useRef } from 'react';
import styles from './page.module.css';
import { createTrip } from '../actions/tripActions';

export default function CreateTrip() {
  const [state, formAction, isPending] = useActionState(createTrip, null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <main className={styles.mainContent}>
      <h1 className={styles.pageTitle}>Plan a new trip</h1>

      {state?.success && (
        <div style={{ padding: '1rem', backgroundColor: 'var(--color-success)', color: 'white', marginBottom: '1rem', borderRadius: '6px' }}>
          {state.message}
        </div>
      )}
      {state?.error && (
        <div style={{ padding: '1rem', backgroundColor: 'var(--color-alert)', color: 'white', marginBottom: '1rem', borderRadius: '6px' }}>
          {state.error}
        </div>
      )}

      <form className={styles.formContainer} action={formAction}>
        
        <div className={styles.formGroup}>
          <label>Cover Photo (Optional)</label>
          <div 
            className={styles.dropzone} 
            onClick={handleDropzoneClick}
            style={{
              backgroundImage: previewUrl ? `url(${previewUrl})` : 'none',
            }}
          >
            {!previewUrl && (
              <div className={styles.dropzoneContent}>
                <span className={styles.uploadIcon}>📷</span>
                <p>Click to upload a beautiful cover photo</p>
              </div>
            )}
            {previewUrl && (
              <div className={styles.dropzoneOverlay}>
                <span>Click to change photo</span>
              </div>
            )}
          </div>
          <input 
            type="file" 
            id="coverPhoto" 
            name="coverPhoto" 
            accept="image/*" 
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="tripName">Trip Name</label>
          <input type="text" id="tripName" name="name" placeholder="e.g., Summer in Europe" required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="place">Select a Place</label>
          <input type="text" id="place" name="place" placeholder="e.g., Paris, France" required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="startDate">Start Date</label>
          <input type="date" id="startDate" name="startDate" required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="endDate">End Date</label>
          <input type="date" id="endDate" name="endDate" required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Trip Description</label>
          <textarea id="description" name="description" rows={4} placeholder="What is the purpose of this trip?"></textarea>
        </div>

        <button type="submit" className={styles.saveButton} disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Trip'}
        </button>
      </form>

      <section className={styles.suggestionsSection}>
        <h2 className={styles.suggestionsTitle}>Suggestions for Places to Visit / Activities to perform</h2>
        <div className={styles.grid}>
          <div className={styles.card} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className={styles.cardOverlay}>
              <div className={styles.cardTitle}>Eiffel Tower, Paris</div>
            </div>
          </div>
          <div className={styles.card} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className={styles.cardOverlay}>
              <div className={styles.cardTitle}>Louvre Museum</div>
            </div>
          </div>
          <div className={styles.card} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className={styles.cardOverlay}>
              <div className={styles.cardTitle}>Seine River Cruise</div>
            </div>
          </div>
          <div className={styles.card} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1466096115517-bceecbfb6fde?auto=format&fit=crop&w=400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className={styles.cardOverlay}>
              <div className={styles.cardTitle}>Montmartre</div>
            </div>
          </div>
          <div className={styles.card} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1522093095166-b8ca16bce358?auto=format&fit=crop&w=400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className={styles.cardOverlay}>
              <div className={styles.cardTitle}>Palace of Versailles</div>
            </div>
          </div>
          <div className={styles.card} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500313830540-7b665030e2f1?auto=format&fit=crop&w=400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className={styles.cardOverlay}>
              <div className={styles.cardTitle}>Notre Dame</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
