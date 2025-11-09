// src/components/Header.jsx
import React from "react";
import "../components/Header.css";
import logo from "../assets/logo.png";
import profile from "../assets/profile.jpg";

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-left">
        <img src={logo} alt="Logo" className="header-logo" />
      </div>

      <div className="header-center">
        <h1 className="header-title">ISAI</h1>
      </div>

      <div className="header-right">
        <img src={profile} alt="Profile" className="profile-img" />
      </div>
    </header>
  );
};

export default Header;
