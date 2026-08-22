import React from 'react';
import styles from './activities.module.css';

interface ResultCardProps {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  photoUrl?: string;
  type?: string;
}

export default function ResultCard({ id, title, subtitle, description, photoUrl, type }: ResultCardProps) {
  // Use a reliable placeholder if photoUrl is missing
  const bgImage = photoUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80';

  return (
    <a href={`/activities/${id}`} className={styles.resultCard}>
      <div 
        className={styles.cardImage} 
        style={{ backgroundImage: `url(${bgImage})` }} 
        aria-label={`Image for ${title}`}
      />
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardSubtitle}>
          {type && <strong>{type} • </strong>}
          {subtitle}
        </p>
        <p className={styles.cardDescription}>{description || 'No description available for this location.'}</p>
      </div>
      <div className={styles.cardArrow} aria-hidden="true">
        ›
      </div>
    </a>
  );
}
