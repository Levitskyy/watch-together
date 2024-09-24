import React, { useState, useEffect, useRef } from 'react';
import 'rc-slider/assets/index.css';
import Filter from '../components/Filter';
import AnimeCard from '../components/AnimeCard';
import { serverURL } from '../App';
import axiosInstance from '../components/axiosInstance';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
  </div>
);

const AnimeList = () => {
  const [animes, setAnimes] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [yearRange, setYearRange] = useState([1900, 2025]);
  const [minRating, setMinRating] = useState(0);
  const [kind, setKind] = useState(null);
  const [minAge, setMinAge] = useState(0);
  const [strictGenres, setStrictGenres] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [hasDataLeft, setHasDataLeft] = useState({value: true});
  const [sortOption, setSortOption] = useState('');

  const skipRef = useRef(0);
  const limit = 20;

  const fetchAnimes = async (params = {}, append = false) => {
    console.log("FETCH IN");
    if (!hasDataLeft.value) {
      console.log("NO DATA");
      return
    };
    setIsFetching(true);
    try {
      const url = new URL(`http://${serverURL}/api/animes/filter`);
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          if (Array.isArray(params[key])) {
            params[key].forEach(value => url.searchParams.append(key, value));
          } else {
            url.searchParams.append(key, params[key]);
          }
        }
      });
      // Extract order_by and asc values from sortOption
      let order_by = '';
      let asc = '';
      if (sortOption) {
        const [field, direction] = sortOption.split('_');
        order_by = field;
        asc = direction === 'asc';
      }

      url.searchParams.append('limit', limit);
      url.searchParams.append('skip', skipRef.current);
      
      if (order_by !== undefined && order_by !== null && order_by !== '') {
        if (asc !== undefined && asc !== null && asc !== '') {
          url.searchParams.append('order_by', order_by);
          url.searchParams.append('asc', asc);
        }       
      }
      const response = await axiosInstance.get(url.toString());
      const data = response.data;

      if (data.length < limit) {
        setHasDataLeft({value: false});
      }

      setAnimes(prev => append ? [...prev, ...data] : data);
      skipRef.current += limit;
    } catch (error) {
      console.error('Error fetching animes:', error);
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAnimes();
  }, []);

  useEffect(() => {
    if (hasDataLeft.value) {  // После того как hasDataLeft обновился на true, запускаем fetchAnimes
        fetchAnimes({
            title: search || undefined,
            genres: selectedGenres.length > 0 ? selectedGenres : undefined,
            min_year: yearRange[0],
            max_year: yearRange[1],
            min_rating: minRating,
            anime_kind: kind,
            minimal_age: minAge,
            genres_and: strictGenres
        });
    }
}, [hasDataLeft]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleGenreChange = (genres) => {
    setSelectedGenres(genres);
  };

  const handleYearRange = (value) => {
    setYearRange(prevYearRange => {
      const newYearRange = [...prevYearRange];
      newYearRange[value.id] = value.value;
      return newYearRange;
    });
    
  };

  const handleMinRating = (value) => {
    setMinRating(value);
  };

  const handleKindChange = (value) => {
    setKind(value);
  };

  const handleMinAgeChange = (value) => {
    setMinAge(value);
  };

  const handleStrictGenresChange = (value) => {
    setStrictGenres(value);
  }

  const handleFilter = () => {
    console.log("PRESSED");
    skipRef.current = 0;
    setHasDataLeft({value: true});
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
        <div className="container mx-auto p-4 flex flex-col md:flex-row gap-4 w-2/3">
          <div className="flex-grow bg-neutral-800 rounded-lg shadow-md p-4 min-h-screen pr-4">
            <h1 className="text-2xl text-neutral-400 mb-3">Каталог</h1>
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
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border p-1 h-8 bg-neutral-800 text-neutral-400 text-base rounded-md ml-2"
              >
                <option value="rating_desc" className="text-neutral-400 text-base">Рейтинг (по убыванию)</option>
                <option value="rating_asc" className="text-neutral-400 text-base">Рейтинг (по возрастанию)</option>
                <option value="year_desc" className="text-neutral-400 text-base">Год (по убыванию)</option>
                <option value="year_asc" className="text-neutral-400 text-base">Год (по возрастанию)</option>
                <option value="title_desc" className="text-neutral-400 text-base">Название (по убыванию)</option>
                <option value="title_asc" className="text-neutral-400 text-base">Название (по возрастанию)</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
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
            onKindChange={handleKindChange}
            onMinAgeChange={handleMinAgeChange}
            onStrictGenresChange={handleStrictGenresChange}
            onApplyFilter={handleFilter}
          />
        </div>
      )}
    </div>
  );
};

export default AnimeList;
