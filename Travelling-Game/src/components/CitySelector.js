// src/components/CitySelector.js - User Interface for Selecting Cities

import React from 'react';

const CitySelector = ({
    cities,
    homeCity,
    selectedCities,
    onCityToggle,
    disabled = false
}) => {
    const availableCities = cities.filter(city => city !== homeCity);

    return (
        <div className="city-selector">
            <h3>Choose Cities</h3>
            <p className="info-text">
                Home: <strong>{homeCity}</strong>
            </p>
            <div className="city-grid">
                {availableCities.map(city => {
                    const isSelected = selectedCities.includes(city);
                    return (
                        <button
                            key={city}
                            className={`city-button ${isSelected ? 'selected' : ''}`}
                            onClick={() => !disabled && onCityToggle(city)}
                            disabled={disabled}
                        >
                            {city}
                            {isSelected && <span className="checkmark">✓</span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CitySelector;

