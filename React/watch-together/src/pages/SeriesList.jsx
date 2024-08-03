import React, { useState } from 'react';
import 'rc-slider/assets/index.css';
import Filter from '../components/Filter';
import MovieCard from '../components/MovieCard';

const seriesList = [
  {
    title: 'Игра престолов',
    genre: 'Фентези',
    rating: '8.5',
    description: 'Краткое описание фильма 1. Краткое описание фильма 1. Краткое описание фильма 1. Краткое описание фильма 1.',
    previewImage: 'https://via.placeholder.com/318x564',
  },
  {
    title: 'Сопрано',
    genre: 'Драма',
    rating: '7.8',
    description: 'Краткое описание сериала 1.',
    previewImage: 'https://via.placeholder.com/318x564',
  },
  {
    title: 'Во все тяжкие 1',
    genre: 'Экшн',
    rating: '7.8',
    description: 'Краткое описание сериала 1.',
    previewImage: 'https://via.placeholder.com/318x564',
  },
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
            {series.map((serie, index) => (
              <li key={serie.index} className="border p-2 mb-2">
                <MovieCard
                  title={serie.title}
                  genre={serie.genre}
                  rating={serie.rating}
                  description={serie.description}
                  previewImage={serie.previewImage}
                />
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
