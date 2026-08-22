import React from 'react';
import { notFound } from 'next/navigation';
import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';
import styles from './detail.module.css';
import { prisma } from '../../../lib/prisma';

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const place = await prisma.place.findUnique({
    where: { id }
  });

  if (!place) {
    notFound();
  }

  const bgImage = place.photoUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className={styles.pageContainer}>
      <Nav />
      
      <div 
        className={styles.heroSection} 
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{place.name}</h1>
          <p className={styles.subtitle}>{place.city}, {place.country}</p>
        </div>
      </div>

      <main className={styles.mainContent}>
        <div className={styles.metaTags}>
          <span className={styles.tag}>{place.placeType || 'Destination'}</span>
          <span className={styles.regionTag}>{place.region || 'Global'}</span>
        </div>

        <div className={styles.description}>
          {place.description ? (
            <p>{place.description}</p>
          ) : (
            <p>Experience the beauty and excitement of {place.name}. This is a fantastic place to visit during your trip to {place.city}.</p>
          )}
        </div>

        <div className={styles.actionSection}>
          <a href="/activities" className={styles.backButton}>&larr; Back to Activities</a>
          <button className={styles.addButton}>+ Add to Itinerary</button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
