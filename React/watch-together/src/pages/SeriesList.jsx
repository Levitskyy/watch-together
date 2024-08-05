import React, { useState, useEffect } from 'react';
import 'rc-slider/assets/index.css';
import Filter from '../components/Filter';
import MovieCard from '../components/MovieCard';

const SeriesList = () => {
  const [series, setSeries] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [yearRange, setYearRange] = useState([1900, 2023]);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    fetchSeries();
  }, []);

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

  const fetchSeries = async (params = {}) => {
    try {
      const url = new URL('http://localhost:8000/movies/');
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          if (Array.isArray(params[key])) {
            params[key].forEach(value => url.searchParams.append(key, value));
          } else {
            url.searchParams.append(key, params[key]);
          }
        }
      });

      const response = await fetch(url.toString());
      const data = await response.json();
      setSeries(data);
    } catch (error) {
      console.error('Error fetching series:', error);
    }
  };

  const filterSeries = () => {
    const params = {
      title: search || undefined,
      genres: selectedGenres.length > 0 ? selectedGenres : undefined,
      min_year: yearRange[0],
      max_year: yearRange[1],
      min_rating: minRating,
    };

    fetchSeries(params);
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
              <li key={index} className="border p-2 mb-2">
                <MovieCard
                  id={serie.id}
                  title={serie.title}
                  genre={serie.genre}
                  rating={serie.rating}
                  description={serie.description}
                  previewImage={'http://localhost:8000/' + serie.image_url}
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
