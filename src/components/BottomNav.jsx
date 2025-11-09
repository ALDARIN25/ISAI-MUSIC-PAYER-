import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaSearch, FaMusic } from "react-icons/fa"; // professional icons
import "./BottomNav.css";

function BottomNav() {
  const location = useLocation();

  const links = [
    { path: "/", label: "Home", icon: <FaHome /> },
    { path: "/search", label: "Search", icon: <FaSearch /> },
    { path: "/playlist", label: "My Playlist", icon: <FaMusic /> },
  ];

  return (
    <nav className="bottom-nav">
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`nav-link ${
            location.pathname === link.path ? "active" : ""
          }`}
        >
          <div className="nav-icon">{link.icon}</div>
          <div className="nav-label">{link.label}</div>
        </Link>
      ))}
    </nav>
  );
}

export default BottomNav;
