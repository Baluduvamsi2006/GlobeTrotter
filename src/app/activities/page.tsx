import React from 'react';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import SearchToolbar from './SearchToolbar';
import ResultCard from './ResultCard';
import styles from './activities.module.css';
import { prisma } from '../../lib/prisma';

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  
  const rawQuery = resolvedParams.q;
  const query = typeof rawQuery === 'string' ? rawQuery : '';
  
  const rawType = resolvedParams.type;
  const typeFilter = typeof rawType === 'string' ? rawType : undefined;

  const rawSort = resolvedParams.sort;
  const sortOrder = rawSort === 'desc' ? 'desc' : 'asc';

  let results: any[] = [];
  
  const whereClause: any = {};
  
  if (query) {
    whereClause.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { city: { contains: query, mode: 'insensitive' } },
      { country: { contains: query, mode: 'insensitive' } },
    ];
  }

  if (typeFilter) {
    whereClause.placeType = { equals: typeFilter, mode: 'insensitive' };
  }

  results = await prisma.place.findMany({
    where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
    orderBy: { name: sortOrder },
    take: 50
  });

  return (
    <div className={styles.pageContainer}>
      <Nav />
      <main className={styles.mainContent}>
        
        <SearchToolbar />

        <h2 className={styles.resultsHeader}>
          {query ? `Results for "${query}"` : typeFilter === 'Activity' ? 'Activities' : typeFilter ? `${typeFilter}s` : "Popular destinations and activities"}
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
