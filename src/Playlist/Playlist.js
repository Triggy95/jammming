
import React, { useEffect, useState } from "react";
import styles from "./Playlist.module.css";
import Tracklist from "../Tracklist/Tracklist";
import Notifier from "../Notifier/Notifier";

export default function Playlist({
    playlist,
    handleRemoveFromPlaylist,
    playlistName,
    setPlaylistName,
    handleSavePlaylist,
}) {
    const [hidden, setHidden] = useState(true);
    const [blink, setBlink] = useState(false);
    const [blinkingInterval, setBlinkingInterval] = useState(null);
    const [isBlinking, setIsBlinking] = useState(false);

    useEffect(() => {
        setBlink(isBlinking);
    }, [isBlinking]);

    const validatePlaylistName = () => {
        if (playlistName === "New Playlist") {
            setHidden(false);
            handleBlink();
            setTimeout(() => {
                setHidden(true);
                stopBlinking();
            }, 5000);
        } else {
            setHidden(true);
            stopBlinking();
        }
    };

    const handleBlink = () => {
        if (!blinkingInterval) {
            const intervalId = setInterval(() => {
                setIsBlinking((prev) => !prev);
            }, 500);
            setBlinkingInterval(intervalId);
        }
    };

    const stopBlinking = () => {
        if (blinkingInterval) {
            clearInterval(blinkingInterval);
            setBlinkingInterval(null);
            setIsBlinking(false);
            setBlink(false);
        }
    };

    return (
        <div className={styles.playlist}>
            <input
                className={` ${styles.playlist_input} ${
                    blink ? styles.blink : ""
                }`}
                type="text"
                value={playlistName}
                onChange={(e) => {
                    setPlaylistName(e.target.value);
                    stopBlinking();
                    if (blink) setBlink(false);
                }}
            />
            <Tracklist
                tracks={playlist}
                handlePlaylistManagement={handleRemoveFromPlaylist}
                add={false}
            />
            <button
                onClick={() => {
                    if (playlist.length > 0) {
                        setHidden(true);
                        handleSavePlaylist();
                    }
                }}
                className={styles.playlistButton}
                onMouseEnter={() => {
                    validatePlaylistName();
                }}
            >
                Save to Spotify
            </button>
            <Notifier hidden={hidden} />
        </div>
    );
}
