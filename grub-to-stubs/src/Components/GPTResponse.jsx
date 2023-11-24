import React from 'react';
import './GPTResponse.css';

const GPTResponse = ({ gptmessage, responseMessage }) => {
  // Function to parse the movie list and add line breaks
  const parseMovies = (recommendations) => {
    if (!recommendations || !Array.isArray(recommendations)) {
      return null; // or handle the error accordingly
    }
  
    return recommendations.map((movie, index) => {
      // Assuming the movie format is "Movie (Year)"
      const [title, year] = movie.split(/\s*\(\s*/);
  
      return (
        <div key={index}>
          {`${index + 1}. ${title} (${year}`}
        </div>
      );
    });
  };
  


  return (
    <div className="answerDiv">
      <div className="answerSubDiv">
        <hr className="hrLine" />
        <div className="responseContainer">
          {responseMessage}
        </div>
        <div className="answerContainer">
         {parseMovies(gptmessage)}
        </div>
        <hr className="hrLine" />
      </div>
      <div className="form-bottom-space"></div>
    </div>
  );
};

export default GPTResponse;
