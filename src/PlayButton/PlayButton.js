
import React, { useContext } from "react";

import styles from "./PlayButton.module.css";

import { PlayPreviewContext, PlayingTrackContext } from "../App/App.js";

export default function PlayButton({ trackPreview }) {
    const playPreview = useContext(PlayPreviewContext);
    const playingTrack = useContext(PlayingTrackContext);
    return (
        <div
            className={styles.playButton}
            onClick={() => {
                playPreview(trackPreview);
            }}
        >
            {trackPreview !== null ? (
                trackPreview !== playingTrack ? (
                    <span className="material-symbols-outlined">
                        play_circle
                    </span>
                ) : (
                    <span className="material-symbols-outlined">
                        pause_circle
                    </span>
                )
            ) : (
                <span className="material-symbols-outlined">cancel</span>
            )}
        </div>
    );
}
