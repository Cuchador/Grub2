// App.js
import React, { useEffect, useState } from 'react';
import Header from './Header';
import CheckOptions from './CheckOptions';
import './App.css'; // Import CSS file for App component

function App() {
  const optionsList = ["Horror", "Fantasy", "Sci-fi", "Thriller", "Action"];
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="app-container" style={{ backgroundColor: `rgba(63, 20, 20, ${scrollPosition / 500})` }}>
      <Header />
      <CheckOptions title="Select the genre(s) you want" options={optionsList} />
    </div>
  );
}

export default App;
