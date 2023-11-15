// CheckOptions.jsx
import React, { useState } from 'react';
import './CheckOptions.css'; // Import CSS file for CheckOptions component

const CheckOptions = ({ title, options }) => {
  const [checkedOptions, setCheckedOptions] = useState([]);

  const handleCheckboxChange = (option) => {
    if (checkedOptions.includes(option)) {
      setCheckedOptions(checkedOptions.filter((item) => item !== option));
    } else {
      setCheckedOptions([...checkedOptions, option]);
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
                checked={checkedOptions.includes(option)}
                onChange={() => handleCheckboxChange(option)}
                className="checkbox-input"
              />
              {option}
            </label>
          </li>
        ))}
      </ul>
      <p className="selected-options">Selected: {checkedOptions.join(', ')}</p>
    </div>
  );
};

export default CheckOptions;
