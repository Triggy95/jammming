import React from "react";
import Track from "../Track/Track";
import styles from '../Tracklist/Tracklist.module.css';

export default function Tracklist ({ tracks, handlePlaylistManagment, add}) {
    return (
        <div className={styles.Tracklist}>
            {tracks ? (tracks.map((track) => {
                return (
                    <Track
                        key={track.id}
                        trackName={track.name}
                        artistName={track.artis}
                        albumName={track.album}
                        trackPreview={track.previewUrl}
                        handleClick={() => handlePlaylistManagment(track)}
                        add={add}
                        />
                );
            })
        ) : (
            <p>No Tracks Available</p>
        )}
        </div>
    );
}