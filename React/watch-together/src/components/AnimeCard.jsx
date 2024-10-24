import React from 'react';
import { Link } from 'react-router-dom';

export const replaceAnimeType = (animeType) => {
  const animeTypes = {
    tv: 'Телесериал',
    tv_special: 'TV-Спешл',
    movie: 'Фильм',
    ona: 'ONA',
    ova: 'OVA',
    special: 'Спешл',
  };

  return animeTypes[animeType] || animeType;
};

const AnimeCard = ({ id, title, rating, poster_url, anime_kind }) => {
  const ratingBackgroundColor = rating >= 8 ? 'bg-green-500' : 'bg-neutral-600';
  const ratingTextColor = rating >= 8 ? 'text-white' : 'text-white';
  const formattedAnimeKind = replaceAnimeType(anime_kind);
  const roundedRating = parseFloat(rating).toFixed(1);

  return (
    <Link to={`/anime/${id}`} className="flex flex-col rounded overflow-hidden m-1 relative text-white w-40 p-2">
      <div className="relative">
        <img className="w-full h-56 rounded-lg" src={poster_url} alt={title} />
        <div className={`absolute top-1 left-1 ${ratingBackgroundColor} ${ratingTextColor} px-1 py-0.5 rounded text-xs font-bold`}>
          {roundedRating} ⭐
        </div>
      </div>
      <div className="px-2 py-1 flex-grow text-left">
        <div className="text-sm text-gray-400 mb-1">{title}</div>
        <div className="text-xs text-gray-400">{formattedAnimeKind}</div>
      </div>
    </Link>
  );
};

export default AnimeCard;
