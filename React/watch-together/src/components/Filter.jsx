import React, { useState, useEffect } from 'react';
import 'rc-slider/assets/index.css';

const serverURL = 'http://localhost:8000/';

const GenresList = ({ genres, selectedGenres, onGenreChange, onBackClick }) => {
  return (
    <div className="w-full bg-neutral-800 text-white rounded-lg p-4 border border-slate-500">
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-neutral-800 py-2 px-4 rounded text-xl text-neutral-400 mb-1 hover:bg-neutral-600 transition duration-300"
          onClick={onBackClick}
        >
        <div className="flex justify-left items-center gap-2">
          <svg className="h-3 w-3 flex-no-shrink fill-current" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path class="" fill="currentColor" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"></path></svg>
          <span className="text-neutral-400 text-base">Жанры</span>
        </div>
        </button>
      </div>
      <hr className="h-px my-4 bg-slate-500 border-0" />
      <div className="mb-4">
        {genres.map((genre) => (
          <label key={genre} className="block ms-1 text-sm font-medium text-slate-300 mb-2">
            <input
              type="checkbox"
              value={genre}
              checked={selectedGenres.includes(genre)}
              onChange={onGenreChange}
              className="w-4 h-4 text-neutral-600 bg-neutral-800 border-slate-500  rounded focus:ring-0"
            />
            <span className="ml-2 text-neutral-400 text-base font-thin">{genre}</span>
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
          <div className="flex justify-between items-center mb-4 border-b pb-2 border-slate-500">
            <button
                className="bg-neutral-800 text-white py-2 px-4 rounded hover:bg-neutral-600 transition duration-300"
                onClick={() => setShowGenresList(true)}
              >
                <div className="flex justify-left items-center gap-1">
                  <span className="text-neutral-400 text-base">Жанры</span>
                  <svg className="h-2 w-2 flex-no-shrink fill-current" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path class="" fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path></svg>
                </div>
                
            </button>
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={strictGenres}
                  onChange={handleStrictGenresChange}
                  className="w-4 h-4 text-gray-600 bg-neutral-800 border-slate-500 rounded focus:ring-0"
                />
                <span className="ml-2 text-neutral-400 text-base">Строгий поиск</span>
              </label>
            </div>
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
