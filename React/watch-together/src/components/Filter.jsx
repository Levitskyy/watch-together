import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const Filter = ({ onGenreChange, onYearChange, onRatingChange, onApplyFilter }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [yearRange, setYearRange] = useState([1900, 2023]);
  const [minRating, setMinRating] = useState(0);

  const genres = [
    'Action',
    'Comedy',
    'Drama',
    'Horror',
    'Sci-Fi',
    'Thriller',
    'Romance',
    'Adventure',
  ];

  const handleGenreChange = (event) => {
    const { value, checked } = event.target;
    const updatedGenres = checked
      ? [...selectedGenres, value]
      : selectedGenres.filter((genre) => genre !== value);
    setSelectedGenres(updatedGenres);
    onGenreChange(updatedGenres);
  };

  const handleYearChange = (value) => {
    setYearRange(value);
    onYearChange(value);
  };

  const handleRatingChange = (value) => {
    setMinRating(value);
    onRatingChange(value);
  };

  const applyFilters = () => {
    onApplyFilter();
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Filter Movies and TV Shows</h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Genres</h3>
        {genres.map((genre) => (
          <label key={genre} className="inline-flex items-center mr-4">
            <input
              type="checkbox"
              value={genre}
              checked={selectedGenres.includes(genre)}
              onChange={handleGenreChange}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">{genre}</span>
          </label>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Year Range</h3>
        <Slider
          range
          min={1900}
          max={2023}
          value={yearRange}
          onChange={handleYearChange}
        />
        <div className="flex justify-between mt-2">
          <span>{yearRange[0]}</span>
          <span>{yearRange[1]}</span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Minimum Rating</h3>
        <Slider
          min={0}
          max={10}
          value={minRating}
          onChange={handleRatingChange}
        />
        <div className="mt-2">{minRating}</div>
      </div>

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={applyFilters}
      >
        Apply Filters
      </button>
    </div>
  );
};

export default Filter;
