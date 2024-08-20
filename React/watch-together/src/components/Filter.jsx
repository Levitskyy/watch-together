import React, { useState, useEffect } from 'react';
import 'rc-slider/assets/index.css';

const serverURL = 'http://localhost:8000/';

const GenresList = ({ genres, selectedGenres, onGenreChange, onBackClick }) => {
  return (
    <div className="w-full md:w-1/3 bg-neutral-800 text-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Select Genres</h2>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={onBackClick}
        >
          Back
        </button>
      </div>
      <div className="mb-4">
        {genres.map((genre) => (
          <label key={genre} className="block px-4 py-2 text-sm text-gray-300">
            <input
              type="checkbox"
              value={genre}
              checked={selectedGenres.includes(genre)}
              onChange={onGenreChange}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="ml-2">{genre}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const Filter = ({ onGenreChange, onYearChange, onRatingChange, onKindChange, onMinAgeChange, onStrictGenresChange,onApplyFilter }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [yearRange, setYearRange] = useState({ min: 1900, max: 2025 });
  const [minRating, setMinRating] = useState(0);
  const [minAge, setMinAge] = useState(0);
  const [genres, setGenres] = useState([]);
  const [kinds, setKinds] = useState([]);
  const [selectedKind, setSelectedKind] = useState(null);
  const [strictGenres, setStrictGenres] = useState(false);
  const [showGenresList, setShowGenresList] = useState(false);

  useEffect(() => {
    fetch(serverURL + 'api/animes/genres')
      .then((response) => response.json())
      .then((data) => setGenres(data))
      .catch((error) => console.error('Error fetching genres:', error));

    fetch(serverURL + 'api/animes/kinds')
      .then((response) => response.json())
      .then((data) => setKinds(data))
      .catch((error) => console.error('Error fetching kinds:', error));
  }, []);

  const handleGenreChange = (event) => {
    const { value, checked } = event.target;
    const updatedGenres = checked
      ? [...selectedGenres, value]
      : selectedGenres.filter((genre) => genre !== value);
    setSelectedGenres(updatedGenres);
    onGenreChange(updatedGenres);
  };

  const handleYearChange = (e) => {
    const { name, value } = e.target;
    setYearRange(prevState => ({ ...prevState, [name]: value }));
    const id = name === 'min' ? 0 : 1;
    onYearChange({id: id, value: value});
  };

  const handleRatingChange = (value) => {
    setMinRating(value);
    onRatingChange(value);
  };

  const handleKindChange = (event) => {
    setSelectedKind(event.target.value);
    onKindChange(event.target.value);
  };

  const handleMinAgeChange = (event) => {
    setMinAge(event.target.value);
    onMinAgeChange(event.target.value);
  };

  const handleStrictGenresChange = () => {
    let value = !strictGenres;
    setStrictGenres(!strictGenres);
    onStrictGenresChange(value);
  };

  const applyFilters = () => {
    onApplyFilter({
      selectedGenres,
      yearRange,
      minRating,
      selectedKind,
      minAge,
      strictGenres,
    });
  };

  return (
    <div className="w-full md:w-1/3 bg-neutral-800 text-white rounded-lg shadow-md p-4">
      {showGenresList ? (
        <GenresList
          genres={genres}
          selectedGenres={selectedGenres}
          onGenreChange={handleGenreChange}
          onBackClick={() => setShowGenresList(false)}
        />
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Filter Animes</h2>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Genres</h3>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={() => setShowGenresList(true)}
            >
              Select Genres
            </button>
            <label className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                checked={strictGenres}
                onChange={handleStrictGenresChange}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2">Strict Genres</span>
            </label>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Year Range</h3>
            <div className="flex items-center">
              <input
                type="text"
                name="min"
                value={yearRange.min}
                onChange={handleYearChange}
                className="border bg-neutral-800 text-white rounded-md p-2 mr-2 w-20"
              />
              <span>-</span>
              <input
                type="text"
                name="max"
                value={yearRange.max}
                onChange={handleYearChange}
                className="border bg-neutral-800 text-white rounded-md p-2 ml-2 w-20"
              />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Minimum Rating</h3>
            <input
              type="range"
              min="0"
              max="10"
              value={minRating}
              onChange={(e) => handleRatingChange(e.target.value)}
              className="w-full"
            />
            <div className="mt-2">{minRating}</div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Kind</h3>
            <select
              value={selectedKind}
              onChange={handleKindChange}
              className="border p-1 h-8 bg-neutral-800 text-white rounded-md ml-2"
            >
              <option value="">Select a kind</option>
              {kinds.map((kind) => (
                <option key={kind} value={kind}>
                  {kind}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Minimum Age</h3>
            <input
              type="number"
              value={minAge}
              onChange={handleMinAgeChange}
              className="bg-neutral-800 text-white rounded-md p-2 w-20"
            />
          </div>

          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
        </>
      )}
    </div>
  );
};

export default Filter;
