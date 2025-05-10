import React from 'react';
import styles from './SearchInput.module.css';

const SearchInput = ({ placeholder, data, onChange, onClick }) => {
    return (
        <div className={styles.searchInputContainer}>
            <input
                type="text"
                className={styles.searchInput}
                placeholder={placeholder}
                value={data}
                onChange={(e) => onChange(e.target.value)}
            />
            <button
                className={styles.searchButton}
                onClick={onClick}
            >
                Пошук
            </button>
        </div>
    );
};

export default SearchInput;
