import React from 'react';
import './CheckOptions.css';

const CheckOptions = ({ title, options, type, onChange }) => {
  const handleCheckboxChange = (option) => {
    onChange(type, option);
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
    </div>
  );
};

export default CheckOptions;
