'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './explore.module.css';

export default function SearchToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || '';
  const initialSort = searchParams.get('sort') || 'asc';
  
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState(initialType);
  const [sort, setSort] = useState(initialSort);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(query, type, sort);
  };

  const applyFilters = (q: string, t: string, s: string) => {
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (t) params.set('type', t);
    if (s !== 'asc') params.set('sort', s); // 'asc' is default, omit to keep URL clean

    router.push(`/explore?${params.toString()}`);
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
        <select 
          className={styles.dropdownButton} 
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            applyFilters(query, e.target.value, sort);
          }}
        >
          <option value="">All Types</option>
          <option value="City">Cities</option>
          <option value="Activity">Activities</option>
        </select>
        
        <select 
          className={styles.dropdownButton}
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            applyFilters(query, type, e.target.value);
          }}
        >
          <option value="asc">Name (A-Z)</option>
          <option value="desc">Name (Z-A)</option>
        </select>
      </div>
    </div>
  );
}
