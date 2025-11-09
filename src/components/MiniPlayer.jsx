import React, { useState } from "react";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaHeart,
  FaRegHeart,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { usePlayer } from "../context/PlayerContext";
import "./MiniPlayer.css";

function MiniPlayer() {
  const {
    audioRef,
    currentSong,
    isPlaying,
    progress,
    duration,
    togglePlay,
    seekTo,
    playlist,
    currentSongId,
    playTrack,
    addToPlaylist,
    removeFromPlaylist,
    toastMessage,
  } = usePlayer();

  const [volume, setVolume] = useState(0.8); // default volume 80%

  if (!currentSong) return null;

  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const currentIndex = playlist.findIndex((s) => s.id === currentSongId);
  const nextSong = playlist[currentIndex + 1];
  const prevSong = playlist[currentIndex - 1];

  const handleNext = () => nextSong && playTrack(nextSong);
  const handlePrev = () => prevSong && playTrack(prevSong);
  const handleSeek = (e) => seekTo(parseFloat(e.target.value));

  const isInPlaylist = playlist.some((song) => song.id === currentSong.id);
  const handleToggleFavorite = () => {
    if (isInPlaylist) removeFromPlaylist(currentSong.id);
    else addToPlaylist(currentSong);
  };

  // 🎚️ Handle volume
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (audioRef.current.volume > 0) {
      setVolume(0);
      audioRef.current.volume = 0;
    } else {
      setVolume(0.8);
      audioRef.current.volume = 0.8;
    }
  };

  return (
    <>
      <div className="mini-player">
        {/* Left: Thumbnail + Song Info */}
        <div className="mini-left">
          <img
            src={
              currentSong.albumCover ||
              currentSong.image ||
              currentSong.cover ||
              "https://via.placeholder.com/150"
            }
            alt={currentSong.title || "Song"}
            className="mini-thumb"
          />
          <div className="mini-info">
            <h4>{currentSong.title || "Unknown Track"}</h4>
            <p>{currentSong.artist || "Unknown Artist"}</p>
          </div>
        </div>

        {/* Center: Controls + Progress */}
        <div className="mini-center">
          <div className="mini-controls">
            <button onClick={handlePrev} disabled={!prevSong}>
              <FaStepBackward />
            </button>
            <button onClick={togglePlay}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={handleNext} disabled={!nextSong}>
              <FaStepForward />
            </button>
          </div>

          <div className="mini-seek">
            <span>{formatTime(progress)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={progress || 0}
              onChange={handleSeek}
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Favorite + Volume */}
        <div className="mini-right">
          <button className="fav-btn" onClick={handleToggleFavorite}>
            {isInPlaylist ? <FaHeart /> : <FaRegHeart />}
          </button>

          {/* 🎚️ Volume Control */}
          <div className="volume-control">
            <button onClick={toggleMute} className="mute-btn">
              {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && <div className="mini-toast">{toastMessage}</div>}
    </>
  );
}

export default MiniPlayer;
