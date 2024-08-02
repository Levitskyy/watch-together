import React, { useState } from 'react';
import 'rc-slider/assets/index.css';
import Filter from '../components/Filter';

const seriesList = [
  { id: 1, title: 'Game of Thrones', genre: 'Fantasy', year: 2011, rating: 9.3 },
  { id: 2, title: 'Breaking Bad', genre: 'Drama', year: 2008, rating: 9.5 },
  { id: 3, title: 'Stranger Things', genre: 'Sci-Fi', year: 2016, rating: 8.7 },
  { id: 4, title: 'The Witcher', genre: 'Fantasy', year: 2019, rating: 8.2 },
  { id: 5, title: 'Chernobyl', genre: 'Drama', year: 2019, rating: 9.4 },
];

const genres = ['Fantasy', 'Drama', 'Sci-Fi', 'Comedy', 'Action'];

const SeriesList = () => {
  const [series, setSeries] = useState(seriesList);
  const [search, setSearch] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [yearRange, setYearRange] = useState([1900, 2023]);
  const [minRating, setMinRating] = useState(0);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleGenreChange = (genres) => {
    setSelectedGenres(genres);
  };

  const handleYearRange = (value) => {
    setYearRange(value);
  };

  const handleMinRating = (value) => {
    setMinRating(value);
  };

  const handleFilter = () => {
    filterSeries();
  };

  const filterSeries = () => {
    let filteredSeries = seriesList;
    if (search) {
      filteredSeries = filteredSeries.filter((serie) =>
        serie.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedGenres.length > 0) {
      filteredSeries = filteredSeries.filter((serie) =>
        selectedGenres.includes(serie.genre)
      );
    }
    if (yearRange) {
      filteredSeries = filteredSeries.filter((serie) =>
        serie.year >= yearRange[0] && serie.year <= yearRange[1]
      );
    }
    if (minRating) {
      filteredSeries = filteredSeries.filter((serie) =>
        serie.rating >= minRating
      );
    }
    setSeries(filteredSeries);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-200 rounded-lg shadow-md min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Series List</h1>
      <div className="flex">
        <div className="flex-grow mr-4">
          <input
            type="text"
            placeholder="Search by title"
            value={search}
            onChange={handleSearch}
            className="border p-1 h-8 mb-2 w-full"
          />
          <ul>
            {series.map((serie) => (
              <li key={serie.id} className="border p-2 mb-2">
                <h2 className="text-xl font-bold">{serie.title}</h2>
                <p>Genre: {serie.genre}</p>
                <p>Year: {serie.year}</p>
                <p>Rating: {serie.rating}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/3">
          <Filter
            onGenreChange={handleGenreChange}
            onYearChange={handleYearRange}
            onRatingChange={handleMinRating}
            onApplyFilter={handleFilter}
          />
        </div>
      </div>
    </div>
  );
};

export default SeriesList;
