import React from 'react';
import styles from 'src/SearchBar/SearchBar.module.css'

export default function SearchBar({
    setSearchValue,
    handleSearch,
    searchValue,
}) {
    function handleSubmit(e){
        e.preventDefault();
        handleSearch();
    }
    return (
        <div className={styles.searchBar}>
            <input
                className={styles.searchInput}
                type='text'
                name='songInput'
                placeholder='Enter song title or artist'
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmit(e);
                }}
                />
                <button onClick={handleSubmit} className={styles.searchButton}>Search</button>
        </div>

    );
}