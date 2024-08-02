import React from 'react';
import Carousel from '../components/Carousel';

const Home = () => {
  const popularReleases = [
    { title: 'Popular Show 1', image: 'https://via.placeholder.com/300x200' },
    { title: 'Popular Show 2', image: 'https://via.placeholder.com/300x200' },
    { title: 'Popular Show 3', image: 'https://via.placeholder.com/300x200' },
  ];

  return (
    <div className="flex items-top justify-center min-h-screen bg-gray-200 py-60">
      <main className="md:w-2/4 md:mx-4 mb-4 md:mb-0">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Добро пожаловать на WatchParty!</h1>
          <p className="text-gray-600 mt-2">WatchParty — это ваше идеальное место для просмотра любимых сериалов и фильмов вместе с друзьями. Создайте комнату, пригласите друзей и наслаждайтесь синхронным просмотром с возможностью общаться в реальном времени. Откройте для себя новый контент, будьте в курсе последних новинок и не пропустите ни одного момента с помощью WatchParty.</p>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Популярные новинки</h2>
            <Carousel items={popularReleases} />
        </section>

        <section className="text-center py-20">
          <a href="/create-room" className="bg-gray-700 text-white px-6 py-3 rounded-full shadow-md hover:bg-gray-400 transition duration-300 inline-block">
            Создать комнату
          </a>
        </section>
      </main>
    </div>
  );
};

export default Home;
