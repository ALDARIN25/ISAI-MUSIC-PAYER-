import React, { useState } from "react";
import { usePlayer } from "../context/PlayerContext";
import "./Search.css";
import logo from "../assets/logo.png";

function Search() {
  const { playTrack, addToPlaylist, removeFromPlaylist, playlist } = usePlayer();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);

  const handleSearch = async () => {
    if (!query) return;
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&limit=20`
      );
      const data = await response.json();
      const songs = data.results
        .filter((item) => item.previewUrl)
        .map((item) => ({
          id: item.trackId,
          title: item.trackName,
          artist: item.artistName,
          albumCover: item.artworkUrl100,
          previewUrl: item.previewUrl,
        }));
      setResults(songs);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handlePlayPause = (song) => {
    if (currentPlayingId === song.id) {
      playTrack(null);
      setCurrentPlayingId(null);
    } else {
      playTrack(song);
      setCurrentPlayingId(song.id);
    }
  };

  const togglePlaylist = (song) => {
    const isInPlaylist = playlist.some((item) => item.id === song.id);
    if (isInPlaylist) removeFromPlaylist(song.id);
    else addToPlaylist(song);
  };

  return (
    <div className="search-page">
      {/* Header */}
      <div className="search-header">
        <img src={logo} alt="Logo" className="search-logo" />
        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search your favorite music..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="results-list">
        {results.map((song) => {
          const isInPlaylist = playlist.some((item) => item.id === song.id);
          return (
            <div className="song-row" key={song.id}>
              <div className="song-left">
                <img
                  src={song.albumCover}
                  alt={song.title}
                  className="song-img"
                />
                <div className="song-details">
                  <p className="song-title">{song.title}</p>
                  <p className="song-artist">{song.artist}</p>
                </div>
              </div>

              <div className="song-actions">
                <button
                  className="play-btn"
                  onClick={() => handlePlayPause(song)}
                >
                  {currentPlayingId === song.id ? "⏸" : "▶"}
                </button>

                {/* Toggle heart icon */}
                <button
                  className="add-btn"
                  onClick={() => togglePlaylist(song)}
                >
                  {isInPlaylist ? "❤️" : "🤍"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Search;
