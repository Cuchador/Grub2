// SearchBox.js
import React from 'react';

const SearchBox = ({ onSearch }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search for foods..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBox;
