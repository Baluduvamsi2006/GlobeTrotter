import React from 'react';
import styles from './SearchFilterBar.module.css';

interface SearchFilterBarProps {
  placeholder?: string;
  onSearch?: (searchTerm: string) => void;
  onGroupBy?: () => void;
  onFilter?: () => void;
  onSortBy?: () => void;
}

export default function SearchFilterBar({
  placeholder = "Search for ...",
  onSearch,
  onGroupBy,
  onFilter,
  onSortBy
}: SearchFilterBarProps) {
  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <svg 
          className={styles.searchIcon} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          type="text" 
          className={styles.searchInput} 
          placeholder={placeholder}
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>
      
      <div className={styles.actions}>
        <button className={styles.actionButton} onClick={onGroupBy}>
          Group by
          <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        <button className={styles.actionButton} onClick={onFilter}>
          Filter
          <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
        </button>
        <button className={styles.actionButton} onClick={onSortBy}>
          Sort by...
          <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
      </div>
    </div>
  );
}
