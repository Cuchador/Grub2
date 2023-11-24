import React, { useState } from 'react';
import CheckOptions from './Components/CheckOptions';
import Header from './Components/Header';
import './App.css';
import FoodForm from './Components/FoodForm';
import GPTResponse from './Components/GPTResponse';
import Loading from './Components/Loading';

function App() {
  const genreList = ["Documentary", "Mystery", "Children", "Action", "Sci-Fi", "Comedy", "Thriller", "Western", "War", "Romance", "IMAX", "Horror", "Drama", "Film-Noir", 
    "Crime", "Animation", "Musical", "Fantasy", "Adventure", "Any genre"];
  const yearsList = ["1950s", "1960s", "1970s", "1980s","1990s","2000s","2010s"];
  const popularityList = ["1", "2", "3", "4", "5"]

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedPopularities, setSelectedPopularities] = useState([]);
  const [gptmessage, setGPTMessage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState([]);
  
  const handleCheckboxChange = (type, option) => {
    switch (type) {
      case 'genre':
        updateSelectedOptions(selectedGenres, setSelectedGenres, option);
        break;
      case 'years':
        updateSelectedOptions(selectedYears, setSelectedYears, option);
        break;
      case 'popularity':
        updateSelectedOptions(selectedPopularities, setSelectedPopularities, option);
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

  const scrollToBottom = () => {
    const headerElement = document.querySelector('.response-container');
    if (headerElement) {
      headerElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  const generateMovieRecomendations = async (selectedFood) => {
    try {
      setIsLoading(true); // Set loading to true when the API call starts

      const response = await fetch('http://127.0.0.1:5000/api/generate-movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedFood,
          selectedGenres,
          selectedYears,
          selectedPopularities,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Movie recommendations:', typeof(data.recommendations));
      setGPTMessage(data.recommendations);

    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false); // Set loading back to false when the API call completes
      scrollToBottom();
      setResponseMessage(`Here are some movies in the [${selectedGenres}] genre(s)
      that were released in the decade(s) of: [${selectedYears}] with a popularity level
      of [${selectedPopularities}].`);
    }
  };
  


  return (
    <div className="app-container">
      <Header />
      <div className="options-list-container">
        <h1 className='preferences-title'>Filter by...</h1>
        <CheckOptions
          className="checkoption-list"
          title="Genre"
          options={genreList}
          type="genre"
          onChange={handleCheckboxChange}
        />
        <CheckOptions
          className="checkoption-list"
          title="Decade"
          options={yearsList}
          type="years"
          onChange={handleCheckboxChange}
        />
        <CheckOptions
          className="checkoption-list"
          title="Popularity (1 for least popular, 5 for most popular)"
          options={popularityList}
          type="popularity"
          onChange={handleCheckboxChange}
        />
      </div>
      <div className="food-form-container">
        <FoodForm onSubmit={generateMovieRecomendations} />
      </div>
      <div className="response-container">
      {isLoading ? <Loading /> : <GPTResponse gptmessage={gptmessage} responseMessage={responseMessage}/>}
      </div>
    </div>
  );
}

export default App;