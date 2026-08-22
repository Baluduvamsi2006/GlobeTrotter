import React from 'react';
import styles from './page.module.css';

export default function CreateTrip() {
  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Plan a new trip</h1>

        <form className={styles.formContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="tripName">Trip Name</label>
            <input type="text" id="tripName" placeholder="e.g., Summer in Europe" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="place">Select a Place</label>
            <input type="text" id="place" placeholder="e.g., Paris, France" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="startDate">Start Date</label>
            <input type="date" id="startDate" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="endDate">End Date</label>
            <input type="date" id="endDate" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Trip Description</label>
            <textarea id="description" rows={4} placeholder="What is the purpose of this trip?"></textarea>
          </div>

          <button type="button" className={styles.saveButton}>Save Trip</button>
        </form>

      </main>
    </div>
  );
}
