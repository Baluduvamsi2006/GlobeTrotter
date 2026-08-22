'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './explore.module.css';

export default function SearchToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/explore?q=${encodeURIComponent(query)}`);
    } else {
      router.push('/explore');
    }
  };

  return (
    <div className={styles.toolbarContainer}>
      <form className={styles.searchForm} onSubmit={handleSearch}>
        <input 
          type="search" 
          name="q"
          className={styles.searchInput} 
          placeholder="Search for destinations, activities, or places... (e.g. Paragliding)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      <div className={styles.controls}>
        <button className={styles.dropdownButton} type="button">
          Group by <span aria-hidden="true">⌄</span>
        </button>
        <button className={styles.dropdownButton} type="button">
          Filter <span aria-hidden="true">⌄</span>
        </button>
        <button className={styles.dropdownButton} type="button">
          Sort by... <span aria-hidden="true">⌄</span>
        </button>
      </div>
    </div>
  );
}
