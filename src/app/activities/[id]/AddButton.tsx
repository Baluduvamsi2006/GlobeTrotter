'use client';
import React from 'react';
import styles from './detail.module.css';

export default function AddButton() {
  return (
    <button 
      className={styles.addButton}
      onClick={() => alert("Added to Itinerary successfully! (Feature coming soon)")}
    >
      + Add to Itinerary
    </button>
  );
}
