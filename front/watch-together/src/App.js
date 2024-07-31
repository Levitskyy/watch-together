import React from 'react';
import './App.css';
import VideoPlayer from './components/VideoPlayer';

function App() {
  return (
    <div className="App">
      <header className="bg-gray-800 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Series Watch Party</h1>
      </header>
      <main className="flex flex-wrap p-4">
        <section id="video-player" className="w-full md:w-2/3 mb-4 md:mb-0 md:mr-4">
          <VideoPlayer url="example.com/video.mp4" title="Sample Video" />
        </section>
        <section id="chat" className="w-full md:w-1/3 mb-4 md:mb-0">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-gray-800">Chat</h2>
            {/* Chat interface will go here */}
          </div>
        </section>
        <section id="user-list" className="w-full md:w-1/3 mb-4 md:mb-0">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-gray-800">User List</h2>
            {/* User list will go here */}
          </div>
        </section>
        <section id="series-selection" className="w-full md:w-1/3 mb-4 md:mb-0">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-gray-800">Series Selection</h2>
            {/* Series selection interface will go here */}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
