import React, { useState } from 'react';
import logo from '../logo.svg'; // Укажите правильный путь к вашему изображению

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-10 w-10 filter invert" />
          <a href="/" className="text-white text-2xl font-bold md:block">AnimeParty</a>
        </div>
        <div className="hidden md:flex space-x-6 items-center">
          <a href="/" className="text-gray-300 hover:text-white transition duration-300">Главная</a>
          <a href="/anime-list" className="text-gray-300 hover:text-white transition duration-300">Список аниме</a>
          <input
            type="text"
            placeholder="Поиск..."
            className="hidden lg:block px-3 py-1 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <a href="/register" className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition duration-300">Регистрация</a>
          <a href="/login" className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 transition duration-300">Логин</a>
        </div>
        <div className="md:hidden">
          <button className="text-white hover:text-gray-300 focus:outline-none" onClick={toggleMenu}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden flex flex-col items-center space-y-2">
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
      )}
    </nav>
  );
};

export default Navbar;
