import React, { useState } from 'react';
import CheckOptions from './Components/CheckOptions';
import Header from './Components/Header';
import './App.css';
import FoodForm from './Components/FoodForm';
import GPTResponse from './Components/GPTResponse';
import OpenAI from 'openai';

function App() {
  const genreList = ["Documentary", "Mystery", "Children", "Action", "Sci-Fi", "Comedy", "Thriller", "Western", "War", "Romance", "IMAX", "Horror", "Drama", "Film-Noir", 
    "Crime", "Animation", "Musical", "Fantasy", "Adventure", "Any genre"];
  const lengthList = ["1 hour", "1-1.5 hours", "2 hours+", "Any length"];
  const yearsList = ["1950s", "1960s", "1970s", "1980s","1990s","2000s","2010s"];

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLengths, setSelectedLengths] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [gptmessage, setGPTMessage] = useState([]);
  const [inputText, setInputText] = useState([]);
  
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

  // const openai = new OpenAI({
  //   apiKey: "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",//Key
  //   dangerouslyAllowBrowser: true
  // });

  // const generateMovieReccomendations = async (selectedFood) => {
  //   setInputText(`Can you suggest 5 movies from the genre(s) ${selectedGenres.join()} strictly between the years of ${selectedYears.join()} that are ${selectedLengths.join()} that have the same vibe as ${selectedFood}? Send the response as a list with each item in its new line as "Name (year)" and include nothing else in your response.`);
  //   const response = await openai.chat.completions.create({
  //     model: "gpt-3.5-turbo",
  //     messages: [{role: "assistant", content: inputText}],
  //   });

  //   setGPTMessage([
  //     {
  //       question: inputText,
  //       answer: response.choices[0].message,
  //     },
  //     ...gptmessage,
  //   ]);
    
  //   console.log(`Selected genres: ${selectedGenres.join(', ')}`);
  //   console.log(`Selected lengths: ${selectedLengths.join(', ')}`);
  //   console.log(`Selected years: ${selectedYears.join(', ')}`);
  //   setInputText("");
  // };
  const generateMovieRecomendations = async (selectedFood) => {
    console.log(selectedGenres)
    try {
      const response = await fetch('http://127.0.0.1:5000/api/generate-movies', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            selectedFood,
            selectedGenres,
            selectedYears,
   
          }),
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Movie recommendations:', data.recommendations);

    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  


  return (
    <div className="app-container">
      <Header />
      <div className="check-options-container">
        <h1 className='check-options-title'>Preferences</h1>
        <CheckOptions
          className="checkoption-list"
          title="Select the genre(s) you prefer"
          options={genreList}
          type="genre"
          onChange={handleCheckboxChange}
        />
        <CheckOptions
          className="checkoption-list"
          title="Select the decade(s) you prefer"
          options={yearsList}
          type="years"
          onChange={handleCheckboxChange}
        />
        <CheckOptions
          className="checkoption-list"
          title="Select the movie length(s) you prefer"
          options={lengthList}
          type="length"
          onChange={handleCheckboxChange}
        />
      </div>
      <div className="food-form-container">
        <FoodForm onSubmit={generateMovieRecomendations} />
      </div>
      <div className="response-container">
      <GPTResponse gptmessage={gptmessage}/>
      </div>
    </div>
  );
}

export default App;