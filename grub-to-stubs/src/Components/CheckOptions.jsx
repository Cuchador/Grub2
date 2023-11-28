import React, { useState } from 'react';
import './CheckOptions.css';

const CheckOptions = ({ title, options, type, onChange, GPTChecked }) => {
  const [showTextBox, setShowTextBox] = useState(false);

  const handleCheckboxChange = (option) => {
    onChange(type, option);
    
    
    // Check if the checkbox is the "onlyGPT" checkbox
    if (type === "onlyGPT") {
      setShowTextBox(!GPTChecked);
    }
  };

  return (
    <div className="check-options-container">
      <h2 className="check-options-title">{title}</h2>
      <ul className="options-list">
        {options.map((option, index) => (
          <li key={index} className="option-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                value={option}
                onChange={() => handleCheckboxChange(option)}
                className="checkbox-input"
              />
              {option}
            </label>
          </li>
        ))}
      </ul>
      {showTextBox && (
        <div className="text-box-container">
          <label htmlFor="GPTFilters">Custom Filters (Optional):</label>
          <input type="text" id="GPTFilters" />
        </div>
      )}
    </div>
  );
};

export default CheckOptions;
