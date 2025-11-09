import React, { useEffect, useState } from "react";
import "../components/Yard.css";
import logo from "../assets/logo.png";
import profilePic from "../assets/profile.jpg";
import videoFile from "../assets/background.mp4";
import { usePlayer } from "../context/PlayerContext";


function Yard() {
  const { playTrack } = usePlayer();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        // Fetch 5 top pop songs
        const topRes = await fetch(
          "https://itunes.apple.com/search?term=pop&entity=song&limit=5"
        );
        const topData = await topRes.json();

        // Fetch 8 rock songs
        const otherRes = await fetch(
          "https://itunes.apple.com/search?term=rock&entity=song&limit=8"
        );
        const otherData = await otherRes.json();

        // Combine tracks and filter only those with previewUrl
        const combined = [
          ...topData.results,
          ...otherData.results
        ]
          .filter(track => track.previewUrl) // only playable tracks
          .map(track => ({
            id: track.trackId,
            title: track.trackName,
            artist: track.artistName,
            albumCover: track.artworkUrl100,
            previewUrl: track.previewUrl
          }));

        setTracks(combined);
      } catch (err) {
        console.error("Error fetching tracks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  return (
    <div className="yard-container">
      {/* Header */}
      <div className="yard-header">
        <div className="header-left">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="header-center">
          <h1 className="header-title">ISAI</h1>
        </div>

        <div className="header-right">
          <img src={profilePic} alt="Profile" className="profile-pic" />
        </div>
      </div>

      {/* Video Section */}
      <div className="yard-main">
        <div className="video-container">
          <video autoPlay loop muted className="background-video">
            <source src={videoFile} type="video/mp4" />
          </video>

          <div class="video-overlay">
            <h1 class="overlay-text">
              <span class="listen">Listen</span>
              <span class="rest">to your </span>
              <span class="listen">favorite</span>
              <span class="rest"> music</span>
            </h1>
          </div>


        </div>
      </div>

      {/* Future Tracks Section */}
      <section className="future-tracks-section">
        <h2 className="section-title">Future Tracks</h2>
        <div className="tracks-grid">
          {loading ? (
            <p style={{ color: "#ffffff", textAlign: "center" }}>
              Loading tracks...
            </p>
          ) : tracks.length > 0 ? (
            tracks.map((track) => (
              <div
                key={track.id}
                className="track-card"
                onClick={() => playTrack(track)}
              >
                <div
                  className="track-img"
                  style={{ backgroundImage: `url(${track.albumCover})` }}
                />
                <h3 className="track-name">{track.title}</h3>
                <p className="track-artist">{track.artist}</p>
              </div>
            ))
          ) : (
            <p style={{ color: "#ffffff", textAlign: "center" }}>
              No tracks available.
            </p>
          )}
        </div>
      </section>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h4>Company</h4>
            <p><a href="#about">About</a></p>
            <p><a href="#jobs">Jobs</a></p>
            <p><a href="#artists">For Artists</a></p>
          </div>
          <div className="footer-section">
            <h4>Communities</h4>
            <p><a href="#fans">For Fans</a></p>
            <p><a href="#developers">Developers</a></p>
          </div>
          <div className="footer-section">
            <h4>Useful Links</h4>
            <p><a href="#help">Help</a></p>
            <p><a href="#privacy">Privacy</a></p>
            <p><a href="#terms">Terms</a></p>
          </div>
          <div className="footer-section social">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://aldarin25.github.io/Portfolio/" target="_blank" rel="noopener noreferrer">WEBSITE</a>
              <a href="https://www.instagram.com/aldarin_jino_/" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://www.linkedin.com/in/aldarin-jino-97265023a/?originalSubdomain=in" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Aldarin's Website. All rights reserved.</p>
        </div>
      </footer>


    </div>
  );
}

export default Yard;
