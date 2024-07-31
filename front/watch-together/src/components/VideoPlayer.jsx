import React from 'react';
import ReactPlayer from 'react-player';

function VideoPlayer({ url, title }) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-w-16 aspect-h-9">
        <ReactPlayer url={url} controls={true} width="100%" height="100%" />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
    </div>
  );
}

export default VideoPlayer;
