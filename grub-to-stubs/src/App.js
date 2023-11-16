import React, { useState } from 'react';
import CheckOptions from './Components/CheckOptions';
import Header from './Components/Header';
import './App.css';
import FoodForm from './Components/FoodForm';

function App() {
  const genreList = ["Horror", "Fantasy", "Sci-fi", "Thriller", "Action", "Any genre"];
  const lengthList = ["1 hour", "1-1.5 hours", "2 hours+", "Any length"];
  const yearsList = ["1960 - 1970", "1970 - 1980", "1980 - 1990", "1990 - 2000", "2000 - 2010", "2010 and onwards"];

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLengths, setSelectedLengths] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);

  const handleCheckboxChange = (type, option) => {
    switch (type) {
      case 'genre':
        updateSelectedOptions(selectedGenres, setSelectedGenres, option);
        break;
      case 'length':
        updateSelectedOptions(selectedLengths, setSelectedLengths, option);
        break;
      case 'years':
        updateSelectedOptions(selectedYears, setSelectedYears, option);
        break;
      default:
        break;
    }
  };

  const updateSelectedOptions = (prevOptions, setOptions, option) => {
    setOptions((prevOptions) => {
      if (prevOptions.includes(option)) {
        return prevOptions.filter((item) => item !== option);
      } else {
        return [...prevOptions, option];
      }
    });
  };

  const handleFoodSubmit = (selectedFood) => {
    console.log(`Selected genres: ${selectedGenres.join(', ')}`);
    console.log(`Selected lengths: ${selectedLengths.join(', ')}`);
    console.log(`Selected years: ${selectedYears.join(', ')}`);
    // Here is where we shall make our API call and do our matrix factorization comparisons yay
  };

  return (
    <div className="app-container">
      <Header />
      <div className="check-options-container">
        <h1 className='check-options-title'>Preferences</h1>
        <CheckOptions
          className="checkoption-list"
          title="Select the genre(s) you want"
          options={genreList}
          type="genre"
          onChange={handleCheckboxChange}
        />
        <CheckOptions
          className="checkoption-list"
          title="Any specific release years you prefer?"
          options={yearsList}
          type="years"
          onChange={handleCheckboxChange}
        />
        <CheckOptions
          className="checkoption-list"
          title="How long do you want the movie to be?"
          options={lengthList}
          type="length"
          onChange={handleCheckboxChange}
        />
      </div>
      <div className="food-form-container">
        <FoodForm onSubmit={handleFoodSubmit} />
      </div>
    </div>
  );
}

export default App;
