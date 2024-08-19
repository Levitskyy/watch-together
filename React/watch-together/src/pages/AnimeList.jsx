import React, { useState, useEffect, useRef } from 'react';
import 'rc-slider/assets/index.css';
import Filter from '../components/Filter';
import AnimeCard from '../components/AnimeCard';

const serverURL = "http://localhost:8000/";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
  </div>
);

const AnimeList = () => {
  const [animes, setAnimes] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [yearRange, setYearRange] = useState([1900, 2023]);
  const [minRating, setMinRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const skipRef = useRef(0); // Используем useRef для хранения skip
  const limit = 20;

  const fetchAnimes = async (params = {}, append = false) => {
    setIsFetching(true);
    try {
      const url = new URL(serverURL + 'api/animes/filter');
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          if (Array.isArray(params[key])) {
            params[key].forEach(value => url.searchParams.append(key, value));
          } else {
            url.searchParams.append(key, params[key]);
          }
        }
      });
      url.searchParams.append('limit', limit);
      url.searchParams.append('skip', skipRef.current); // Используем значение из useRef
      const response = await fetch(url.toString());
      const data = await response.json();
      setAnimes(prev => append ? [...prev, ...data] : data);
      skipRef.current += limit; // Обновляем skip в useRef только после успешного запроса
    } catch (error) {
      console.error('Error fetching animes:', error);
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimes();
    console.log("START ", skipRef.current);
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
    skipRef.current = 0; // Сбрасываем skip при фильтрации
    fetchAnimes({
      title: search || undefined,
      genres: selectedGenres.length > 0 ? selectedGenres : undefined,
      min_year: yearRange[0],
      max_year: yearRange[1],
      min_rating: minRating,
    });
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isFetching) return;
    fetchAnimes({
      title: search || undefined,
      genres: selectedGenres.length > 0 ? selectedGenres : undefined,
      min_year: yearRange[0],
      max_year: yearRange[1],
      min_rating: minRating,
    }, true);
    console.log("SCROLL ", skipRef.current);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFetching]);

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="container mx-auto p-4 flex flex-col md:flex-row gap-4 w-8/12">
          <div className="flex-grow bg-neutral-800 rounded-lg shadow-md p-4 min-h-screen pr-4">
            <h1 className="text-2xl font-bold mb-2">Каталог</h1>
            <div className="relative flex mb-2">
              <input
                type="text"
                placeholder="Поиск по названию"
                value={search}
                onChange={handleSearch}
                className="border p-1 h-8 w-full bg-neutral-800 text-white pl-10 rounded-md"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {animes.map((anime, index) => (
                <AnimeCard
                  key={index}
                  id={anime.id}
                  title={anime.title}
                  rating={anime.shikimori_rating}
                  poster_url={anime.poster_url}
                  anime_kind={anime.anime_kind}
                />
              ))}
            </div>
            {isFetching && <LoadingSpinner />}
          </div>
          <Filter
            onGenreChange={handleGenreChange}
            onYearChange={handleYearRange}
            onRatingChange={handleMinRating}
            onApplyFilter={handleFilter}
          />
        </div>
      )}
    </div>
  );
};

export default AnimeList;
