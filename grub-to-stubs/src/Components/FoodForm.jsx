// FoodForm.jsx
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const FoodForm = ({ onSubmit }) => {
  const [selectedFood, setSelectedFood] = useState('');
  const [customFood, setCustomFood] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [foodOptions, setFoodOptions] = useState([]);

  useEffect(() => {
    // Read data from the CSV file using Papa.parse
    Papa.parse('mappings.csv', {
      download: true,
      header: true,
      complete: (result) => {
        console.log(result)
        // Extract food options from CSV data
        const options = result.data.map((row) => row.food);
        // Add 'Other' to the options
        options.push('Other');
        // Set foodOptions state
        setFoodOptions(options);
      },
    });
  }, []);

  const handleFoodChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedFood(selectedValue);

    if (selectedValue === 'Other') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
    }
  };

  const handleCustomFoodChange = (event) => {
    setCustomFood(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const selected = selectedFood === 'Other' ? customFood : selectedFood;

    if (selected) {
      onSubmit(selected);
    }
  };

  return (
    <div className="food-form">
      <h2>Select the food you will be eating for your movie.</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Select a food:
          <select value={selectedFood} onChange={handleFoodChange}>
            {foodOptions.map((option, index) => (
              <option key={index} value={option}>
                {index === 0 ? 'Select a food' : option}
              </option>
            ))}
          </select>
        </label>

        {showCustomInput && (
          <label>
            Other:
            <input type="text" value={customFood} onChange={handleCustomFoodChange} />
          </label>
        )}

        <button type="submit">Generate movies!</button>
      </form>
    </div>
  );
};

export default FoodForm;
