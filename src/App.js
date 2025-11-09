import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Yard from "./components/Yard";
import Search from "./pages/Search";
import MyPlaylist from "./pages/MyPlaylist";
import "./index.css";
import "./styles.css";
import { PlayerProvider } from "./context/PlayerContext";
import MiniPlayer from "./components/MiniPlayer";
import BottomNav from "./components/BottomNav";

function App() {
  return (
    <PlayerProvider>
      <Router>
        <div style={{ paddingBottom: 140 }}>
          <Routes>
            <Route path="/" element={<Yard />} />
            <Route path="/search" element={<Search />} />
            <Route path="/playlist" element={<MyPlaylist />} />
            <Route path="*" element={<Yard />} />
          </Routes>
        </div>

        <MiniPlayer />
        <BottomNav />
      </Router>
    </PlayerProvider>
  );
}

export default App;
