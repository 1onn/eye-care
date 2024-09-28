import React, { useState } from "react";
import "./CSS/MultiDrop.css";

const MultiSelectDropdown = ({ options, selectedOptions, setSelectedOptions, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckboxChange = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(item => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <div className="multi-select-dropdown">
      <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
        {label}
        <span className="dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <div className="dropdown-list">
          {options.map((option, index) => (
            <label key={index} className="dropdown-item">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => handleCheckboxChange(option)}
              />
              {option}
            </label>
          ))}
        </div>
      )}
      <div className="selected-options">
        {selectedOptions.map((option, index) => (
          <span key={index} className="selected-option">
            {option}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MultiSelectDropdown;
