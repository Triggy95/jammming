import React from "react";
import styles from './Track.module.css';
import PlayButton from '../PlayButton/PlayButton';

export default function Track({
    trackName,
    artistName,
    albumName,
    handleClick,
    add,
    trackPreview
}) {
    return (
        <div className={styles.track}>
            <div className={styles.trackInfo}>
                <h2 className={styles.trackInfo_name}>{trackName}</h2>
                <div className={styles.trackInfo_lower}>
                    <p className={`${styles.trackInfo_details}`}>
                        {artistName}
                    </p>
                    <p className={`${styles.trackInfo_details} ${styles.trackInfo_spacer}`}>
                        |
                    </p>
                    <p className={`${styles.trackInfo_details}`}>{albumName}</p>
                </div>
            </div>
            <PlayButton trackPreview={trackPreview}/>
            <button onClick={() => {
                handleClick();
            }}
            className={styles.track_add}
            >
                {add === true ? '+' : '-'}
            </button>
        </div>
    );
}