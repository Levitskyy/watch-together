import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { replaceAnimeType } from '../components/AnimeCard';
import friends from '../svg/friends.svg'

const serverURL = 'http://localhost:8000/';

const episodes = [
  {id: 1, title: '1'},
  {id: 2, title: '2'},
  {id: 3, title: '3'},
  {id: 4, title: '4'},
]

const dubs = [
  {id: 0, name: 'Anilib'},
  {id: 1, name: 'Ancord'},
  {id: 2, name: 'Dreamcast'},
]

const mapStatusToRussian = (status) => {
  const statusMap = {
    ongoing: 'Онгоинг',
    released: 'Вышло',
    anons: 'Анонс',
  };

  return statusMap[status] || status;
};

const getRatingColor = (rating) => {
  if (rating >= 8) return 'bg-green-500';
  if (rating >= 6) return 'bg-yellow-500';
  if (rating >= 4) return 'bg-orange-500';
  return 'bg-red-500';
};

const AnimePage = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);

  useEffect(() => {
    fetch(serverURL + `api/animes/${id}`)
      .then((response) => response.json())
      .then((data) => setAnime(data))
      .catch((error) => console.error('Error fetching anime:', error));
  }, [id]);

  if (!anime) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full bg-neutral-900 text-white min-h-screen">
      <div className="container mx-auto flex flex-col md:flex-row justify-center w-11/12 gap-12 pt-12">
        <div className="flex flex-col max-w-64">
          <img src={anime.poster_url} alt={anime.title} className="w-full h-auto rounded-lg" />
          <div className="flex flex-col mt-4">
            <a href="#" className="flex gap-2 justify-left w-full bg-green-600 py-1 px-3 rounded mb-2 hover:bg-green-500 transition duration-300">
              <svg className="svg-inline--fa fa-play fa-fw w-3" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path></svg>
              <span>Начать смотреть</span>
            </a>
            <a href="#" className="flex gap-2 justify-left w-full bg-purple-700 py-1 px-3 rounded mb-2 hover:bg-purple-500 transition duration-300">
              <img src={friends} alt="friends" className="w-3 filter invert" />
              <span>Смотреть с друзьями</span>
            </a>
          </div>
        </div>
        <div className="w-2/3 bg-neutral-800 rounded p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-semibold text-slate-200">{anime.title}</h1>
            <div className={`flex items-center ${getRatingColor(anime.shikimori_rating)} text-white px-2 py-1 rounded`}>
              <span className="text-xl font-bold">★</span>
              <span className="text-xl font-bold ml-1">{anime.shikimori_rating}</span>
              <span className="text-xs ml-2 text-slate-200">({anime.shikimori_votes})</span>
            </div>
          </div>
          <p className="text-slate-500 mb-4">{anime.description}</p>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-200 mb-2">Альт. названия</h2>
            <p className="text-slate-500">{anime.other_titles.join('; ')}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-200 mb-2">Кол-во эпизодов</h2>
            <p className="text-slate-500">{anime.released_episodes ? anime.released_episodes : anime.total_episode ? anime.total_episode : '?'}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-200 mb-2">Жанры</h2>
            <p className="text-slate-500">{anime.anime_genres.join(', ')}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-200 mb-2">Мин. возраст</h2>
            <p className="text-slate-500">{anime.minimal_age ? anime.minimal_age : '?'}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-200 mb-2">Студии</h2>
            <p className="text-slate-500">{anime.anime_studios.join(', ')}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-200 mb-2">Статус</h2>
            <p className="text-slate-500">{mapStatusToRussian(anime.status)}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-200 mb-2">Год выхода</h2>
            <p className="text-slate-500">{anime.year}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-200 mb-2">Тип</h2>
            <p className="text-slate-500">{replaceAnimeType(anime.anime_kind)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimePage;
