import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ id, title, genre, rating, description, previewImage }) => {
  const ratingBackgroundColor = rating >= 8 ? 'bg-yellow-500' : 'bg-gray-500';

  return (
    <Link to={`/movies/${id}`} className="flex rounded overflow-hidden shadow-lg m-4 relative">
      <img className="w-48 h-auto object-cover" src={previewImage} alt={title} />
      <div className="flex-grow px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{genre}</p>
        <p className="text-gray-700 text-base mt-2 overflow-hidden text-ellipsis">{description}</p>
      </div>
      <div className={`absolute top-2 right-2 ${ratingBackgroundColor} text-white px-2 py-1 rounded-full`}>
        {rating} ⭐
      </div>
    </Link>
  );
};

export default MovieCard;
