// Header.jsx
import React from 'react';
import './Header.css'; // Import CSS file for Header component
import logo from "./Grub2StubsLogo.png"

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-overlay"></div>
      <h1 className="app-title">Welome to Grub2Stubs!</h1>
      <img
        className="header-image"
        src={logo} // Replace with the path to your image
        alt="Header Image"
      />
    </header>
  );
};

export default Header;

