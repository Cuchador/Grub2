import React, { useState } from 'react';
import CheckOptions from './Components/CheckOptions';
import Header from './Components/Header';
import './App.css';
import FoodForm from './Components/FoodForm';
import GPTResponse from './Components/GPTResponse';
import Loading from './Components/Loading';

function App() {
  const genreList = ["Documentary", "Mystery", "Children", "Action", "Sci-Fi", "Comedy", "Thriller", "Western", "War", "Romance", "IMAX", "Horror", "Drama", "Film-Noir",
    "Crime", "Animation", "Musical", "Fantasy", "Adventure"];
  const yearsList = ["1950", "1960", "1970", "1980", "1990", "2000", "2010"];
  const popularityList = ["1", "2", "3", "4", "5"]

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedPopularities, setSelectedPopularities] = useState([]);
  const [gptmessage, setGPTMessage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState([]);
  const [onlyGPT, setOnlyGPT] = useState(false);

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

  const handleYesCheckboxChange = () => {
    setOnlyGPT((prevOnlyGPT) => !prevOnlyGPT);
    console.log(onlyGPT);
  };

  const scrollToBottom = () => {
    const headerElement = document.querySelector('.response-container');
    if (headerElement) {
      headerElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  const formatList = (list) => {
    if (list.length === 0) return '';
    if (list.length === 1) return list[0];
    if (list.length === 2) return `${list[0]} and ${list[1]}`;
    return `${list.slice(0, -1).join(', ')}, and ${list.slice(-1)}`;
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
          onlyGPT,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Movie recommendations:', typeof (data.recommendations));
      setGPTMessage(data.recommendations);

    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false); // Set loading back to false when the API call completes
      scrollToBottom();
      const genresText = selectedGenres.length > 0 ? ` in the ${formatList(selectedGenres)} genre(s)` : '';
      const yearsText = selectedYears.length > 0 ? ` that were released in the decade(s) of ${formatList(selectedYears)}` : '';
      const popularitiesText = selectedPopularities.length > 0 ? ` with a popularity level of ${formatList(selectedPopularities)}` : '';

      const message = `Here are some movies${genresText}${yearsText}${popularitiesText}.`;

      setResponseMessage(message);
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
        <CheckOptions
          className="checkoption-list"
          title="Our recommendations come from a mix of ChatGPT and our own model. Would you like them to come purely from ChatGPT (experimental)?"
          options={["Yes"]}
          type="onlyGPT"
          onChange={handleYesCheckboxChange}
        />
      </div>
      <div className="food-form-container">
        <FoodForm onSubmit={generateMovieRecomendations} />
      </div>
      <div className="response-container">
        {isLoading ? <Loading /> : <GPTResponse gptmessage={gptmessage} responseMessage={responseMessage} />}
      </div>
    </div>
  );
}

export default App;