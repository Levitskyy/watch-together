import React from 'react';
import logo from '../logo.svg';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 w-10 mr-3 filter invert" />
          <span className="text-white text-2xl font-bold">AnimeParty</span>
        </div>
        <div className="flex space-x-6 items-center">
          <a href="/" className="text-gray-300 hover:text-white transition duration-300">Главная</a>
          <a href="/anime-list" className="text-gray-300 hover:text-white transition duration-300">Список аниме</a>
          <input
            type="text"
            placeholder="Поиск..."
            className="px-3 py-1 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <a href="/register" className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition duration-300">Регистрация</a>
          <a href="/login" className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 transition duration-300">Логин</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
