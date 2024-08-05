import React from 'react';
import ReactPlayer from 'react-player';

const server = "http://localhost:8000/";

const MoviePage = ({ id, title, image_url, stream_url, rating, description, year, genres }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            <img src={server + image_url} alt={title} className="w-full h-auto rounded-lg shadow-md" />
          </div>
          <div className="md:w-2/3 md:pl-6">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <div className="flex items-center mb-4">
              <span className="text-yellow-500 mr-2">★ {rating}</span>
              <span className="text-gray-600">{year}</span>
            </div>
            <p className="text-gray-700 mb-4">{description}</p>
            <div className="flex flex-wrap mb-4">
              {genres.map((genre) => (
                <span key={genre.id} className="bg-gray-200 text-gray-700 px-2 py-1 rounded mr-2 mb-2">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
        <ReactPlayer url={server + stream_url} controls width="100%" height="auto" />
      </div>
    </div>
  );
};

export default MoviePage;
