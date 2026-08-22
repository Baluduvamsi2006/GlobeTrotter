import React from 'react';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import SearchToolbar from './SearchToolbar';
import ResultCard from './ResultCard';
import styles from './explore.module.css';
import { prisma } from '../../lib/prisma';

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const rawQuery = resolvedParams.q;
  const query = typeof rawQuery === 'string' ? rawQuery : '';

  let results: any[] = [];
  
  if (query) {
    // Search the Place table for anything matching name, city, country, or placeType
    results = await prisma.place.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { city: { contains: query, mode: 'insensitive' } },
          { country: { contains: query, mode: 'insensitive' } },
          { placeType: { contains: query, mode: 'insensitive' } },
        ]
      },
      orderBy: { name: 'asc' }, // simple alphabetical sorting for now
      take: 20
    });
  } else {
    // If no query, show some default popular places
    results = await prisma.place.findMany({
      orderBy: { name: 'asc' },
      take: 10
    });
  }

  return (
    <div className={styles.pageContainer}>
      <Nav />
      <main className={styles.mainContent}>
        
        <SearchToolbar />

        <h2 className={styles.resultsHeader}>
          {query ? `Results for "${query}"` : "Popular destinations and activities"}
        </h2>
        
        <div className={styles.resultsGrid}>
          {results.length > 0 ? (
            results.map((place) => (
              <ResultCard
                key={place.id}
                id={place.id}
                title={place.name}
                subtitle={`${place.city}, ${place.country}`}
                description={place.description || 'Explore this amazing destination!'}
                photoUrl={place.photoUrl || undefined}
                type={place.placeType || undefined}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              <h3>No results found</h3>
              <p>Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
}
