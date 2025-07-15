import React from "react";
import Tracklist from '../Tracklist/Tracklist';
import styles from '../SearchResults/SearchResults.module.css';

export default function SearchResults({ SearchResults, handleAddToPlaylist}){
    return (
        <div className={styles.SearchResults}>
            <h2 className={styles.searchResults_header}>Search Results</h2>
            <Tracklist
                tracks={SearchResults}
                handlePlaylistManagment={handleAddToPlaylist}
                add={true}
                />
        </div>
    );
}