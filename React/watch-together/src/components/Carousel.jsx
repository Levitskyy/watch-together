// Carousel.js
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Carousel = ({ items }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true, // Центрирование элементов
    centerPadding: '60px', // Отступы по краям
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerPadding: '40px',
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          centerPadding: '20px',
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {items.map((item, index) => (
        <div key={index} className="flex justify-center">
          <div className="text-center px-2">
            <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
            <img src={item.image} alt={item.title} className="mx-auto" />
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default Carousel;
