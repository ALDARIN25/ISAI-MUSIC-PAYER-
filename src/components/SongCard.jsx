import React from "react";
import "./SongCard.css";

export default function SongCard({ song, onPlay }) {
  return (
    <div className="song-card" onClick={() => onPlay && onPlay(song)}>
      <div
        className="song-img"
        style={{ backgroundImage: `url(${song.albumCover || song.artworkUrl100})` }}
      />
      <h6 className="song-title">{song.title || song.trackName}</h6>
      <p className="song-artist">{song.artist || song.artistName}</p>
    </div>
  );
}
