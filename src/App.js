// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
      
          
import Search from "./pages/Search";          
import MyPlaylist from "./pages/MyPlaylist";  
import Yard from "./components/Yard";          

import "./index.css";
import "./styles.css";
import { PlayerProvider, usePlayer } from "./context/PlayerContext"; 
import MiniPlayer from "./components/MiniPlayer"; 
import BottomNav from "./components/BottomNav";  

function HomeWrapper() {
  const { playTrack } = usePlayer();
  return <HomePage onPlay={playTrack} />;
}

function App() {
  return (
    <PlayerProvider>
      <Router>
        <div style={{ paddingBottom: 140 }}>
          <Routes>
            <Route path="/" element={<Yard />} />
            <Route path="/home" element={<HomeWrapper />} />
            <Route path="/search" element={<Search />} />
            <Route path="/playlist" element={<MyPlaylist />} />
            
          </Routes>
        </div>

        {/* Global Components */}
        <MiniPlayer />
        <BottomNav />
      </Router>
    </PlayerProvider>
  );
}

export default App;
