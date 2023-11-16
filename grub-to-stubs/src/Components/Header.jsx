// Header.jsx
import React from 'react';
import './Header.css'; // Import CSS file for Header component
import logo from "./Grub2StubsLogo.png"

const Header = () => {
  const scrollToBottom = () => {
    const headerElement = document.querySelector('.check-options-title');
    if (headerElement) {
      headerElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };
  return (
    <header className="app-header">
      
      <h1 className="app-title">Welcome to Grub2Stubs!</h1>
      <p className="introduction1">
        Imagine that you and your friends/family are planning to watch a movie together. It is always a difficult task to decide upon one which 
        everyone wants to watch in the first place. Now, imagine further that you are all hungry, and can at least decide on a type of food to make or order. 
      </p>
      <p className='introduction2'>
        Here's where we come in to help! Given a set of your preferences on food choice, we will recommend you a set of movies. Additionally, we can recommend you a movie given
        preferences like genre, release year, and more. When you're ready to get started, scroll down or click the button below. Enjoy!
      </p>
      <button className="scroll-to-bottom-button" onClick={scrollToBottom}>
        Get Started
      </button>
      <img
        className="header-image"
        src={logo} // Replace with the path to your image
        alt="Grub2Stubs Logo"
      />
    </header>
  );
};

export default Header;

