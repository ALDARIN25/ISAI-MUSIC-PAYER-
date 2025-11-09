// client/src/context/PlayerContext.js
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const PlayerContext = createContext();

export function usePlayer() {
  return useContext(PlayerContext);
}

export function PlayerProvider({ children }) {
  const audioRef = useRef(null); // will hold HTMLAudioElement
  const [currentSong, setCurrentSong] = useState(null);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [currentTrack, setCurrentTrack] = useState(null);

  const [progress, setProgress] = useState(0); // seconds
  const [duration, setDuration] = useState(0); // seconds
  const [playlist, setPlaylist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("myPlaylist") || "[]");
    } catch {
      return [];
    }
  });
  const [toast, setToast] = useState(null);

  // Create audio element once
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime || 0);
    };
    const handleDurationChange = () => {
      setDuration(audio.duration || 0);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleDurationChange);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleDurationChange);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      // do not null audioRef.current here; keep instance for HMR stability
    };
  }, []);

  // Persist playlist
  useEffect(() => {
    try {
      localStorage.setItem("myPlaylist", JSON.stringify(playlist));
    } catch (e) {
      // ignore
    }
  }, [playlist]);

  const showToast = (msg, ms = 1400) => {
    setToast(msg);
    setTimeout(() => setToast(null), ms);
  };

  // Play a song (expects song.previewUrl OR song.preview_url OR song.url OR song.audioUrl)
  const playTrack = (song) => {
    if (!song) return;
    // pick common preview fields
    const src = song.previewUrl || song.preview_url || song.url || song.audioUrl || song.previewUrl110;
    if (!src) {
      showToast("No preview available for this track");
      // Still set as current song so UI shows details (optional)
      setCurrentSong(song);
      setCurrentSongId(song.id ?? null);
      setIsPlaying(false);
      return;
    }

    try {
      const audio = audioRef.current || (audioRef.current = new Audio());
      // If same song id => toggle play/pause
      if (currentSongId && song.id && currentSongId === song.id) {
        if (audio.paused) {
          audio.play().catch(() => { });
          setIsPlaying(true);
        } else {
          audio.pause();
          setIsPlaying(false);
        }
        return;
      }

      // New song: set src and play
      audio.pause();
      audio.src = src;
      audio.currentTime = 0;
      audio.play().catch(() => {
        // autoplay restrictions — still update UI
      });

      setCurrentSong(song);
      setCurrentSongId(song.id ?? null);
      setIsPlaying(true);
      setProgress(0);
      // duration will be set by loadedmetadata listener
    } catch (err) {
      console.error("playTrack error:", err);
      showToast("Playback error");
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    if (audio.paused) {
      audio.play().catch(() => { });
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  // seekTo accepts seconds (number)
  const seekTo = (timeInSeconds) => {
    const audio = audioRef.current;
    if (!audio || typeof timeInSeconds !== "number" || !isFinite(timeInSeconds)) return;
    try {
      // clamp
      const t = Math.max(0, Math.min(timeInSeconds, audio.duration || timeInSeconds));
      audio.currentTime = t;
      setProgress(t);
    } catch (err) {
      console.error("seekTo error", err);
    }
  };

  const addToPlaylist = (song) => {
  setPlaylist((prev) => {
    if (!prev.find((item) => item.id === song.id)) {
      setToastMessage(`${song.title} was added to your playlist ❤️`);
      setTimeout(() => setToastMessage(""), 2500);
      return [...prev, song];
    }
    return prev;
  });
};

  const removeFromPlaylist = (songId) => {
    if (!songId) {
      console.error("No songId provided to removeFromPlaylist");
      return;
    }

    setPlaylist((prev) => prev.filter((song) => song.id !== songId));

    if (currentTrack && currentTrack.id === songId) {
      setCurrentTrack(null); // stop playing if the deleted song was the current one
    }

  }


  const value = {
    audioRef,
    currentSong,
    currentSongId,
    isPlaying,
    progress,      // seconds
    duration,      // seconds
    playTrack,
    togglePlay,
    seekTo,
    addToPlaylist,
    removeFromPlaylist,
    playlist,
    toastMessage,
    showToast,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      {/* optional: small hidden audio element is not required because we use audioRef,
          but keeping no DOM audio to avoid duplicates. */}
    </PlayerContext.Provider>
  );
}
