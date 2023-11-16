// FoodForm.jsx
import React, { useState } from 'react';

const FoodForm = ({ onSubmit }) => {
  const [selectedFood, setSelectedFood] = useState('');
  const [customFood, setCustomFood] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const foodOptions = ["Pizza", "Burger", "Salad", "Pasta", "Other"];

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
      <h2>Now, the most important part! Select the food you will be eating for your movie. (to enter multiple foods, select 'other' and enter them into the text box separated by a comma)</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Select a food:
          <select value={selectedFood} onChange={handleFoodChange}>
            {foodOptions.map((option) => (
              <option key={option} value={option}>
                {option}
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

      {/* Extra whitespace below the form */}
      <div className="form-bottom-space"></div>
    </div>
  );
};

export default FoodForm;
