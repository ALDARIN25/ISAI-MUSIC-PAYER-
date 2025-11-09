import { usePlayer } from "../context/PlayerContext";
import "./MyPlaylist.css";
import logo from "../assets/logo.png";

function MyPlaylist() {
  const { playlist, playTrack, removeFromPlaylist } = usePlayer();

  return (
    <div className="myplaylist-page">
      {/* ===== Sticky Video Section ===== */}
      <div className="myplaylist-video-container">
        <video autoPlay loop muted playsInline>
          <source src={require("../assets/bg.mp4")} type="video/mp4" />
        </video>

        {/* Overlay Content */}
        <div className="myplaylist-overlay">
          <img src={logo} alt="Logo" className="playlist-logo" />
          <h1 className="playlist-heading">My Playlist</h1>
        </div>

        {/* Fade Transition at Bottom */}
        <div className="video-fade-overlay"></div>
      </div>

      {/* ===== Playlist Section ===== */}
      <div className="myplaylist-section">
        <div className="myplaylist-box">
          {playlist.length === 0 ? (
            <p className="no-tracks">
              Your playlist is empty. Add songs from Search to build your playlist.
            </p>
          ) : (
            <div className="myplaylist-grid">
              {playlist.map((song) => (
                <div className="myplaylist-card" key={song.id}>
                  <div className="myplaylist-img">
                    <img
                      src={song.albumCover}
                      alt={song.title}
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/150")
                      }
                    />
                  </div>

                  <div className="myplaylist-info">
                    <div className="track-title">{song.title}</div>
                    <div className="track-artist">{song.artist}</div>
                  </div>

                  <div className="myplaylist-actions">
                    <button className="play-btn" onClick={() => playTrack(song)}>
                      ▶ Play
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromPlaylist(song.id)}
                    >
                      ✖ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyPlaylist;
