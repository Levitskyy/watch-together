import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance';
import { serverURL } from '../App';
import LoadingSpinner from './LoadingSpinner';

const RatingPopup = ({ animeId, ratingClickHandler }) => {
  const [rating, setRating] = useState(0);
  const [fetchedRating, setFetchedRating] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyRating = async () => {
      try {
        const response = await axiosInstance.get(
          `http://${serverURL}/api/ratings/my/${animeId}`, 
          {
          },
          {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
          }
        );
        if (response.status === 200) {
          setFetchedRating(response.data);
          setIsLoading(false);
        } else {
          setFetchedRating(null);
          setIsLoading(false);
        }
      } catch (error) {
        if (error.response.status === 404) {
          setFetchedRating(null);
        }
        console.error('Error fetching rating:', error);
        setIsLoading(false);
      }
    };
    fetchMyRating();
  }, []);

  useEffect(() => {
    if (fetchedRating) {
      setRating(fetchedRating);
    }
  }, [fetchedRating]);

  const handleInnerClick = (e) => {
    e.stopPropagation();
  };

  const handleStarClick = (star) => {
    setRating(star);
  };

  const handleSubmitRating = () => {
    const changeMyRating = async () => {
      try {
        const response = await axiosInstance.post(
          `http://${serverURL}/api/ratings/rate`, 
          {
            anime_id: animeId,
            rating: rating
          },
          {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
          }
        );
      } catch (error) {
        console.error('Error changing rating:', error);
      }
    };
    if (rating > 0) {
      changeMyRating();
    }
    ratingClickHandler();
  };

  return (
    <div onClick={ratingClickHandler} className="w-screen h-screen bg-black bg-opacity-50 fixed top-0 right-0 flex justify-center items-center">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div onClick={handleInnerClick} className="bg-neutral-800 rounded p-5 flex justify-center flex-col">
          <h1 className="text-white text-2xl mb-4">Оценить аниме</h1>
          <div className='flex justify-center p-2'>
            <span className={`text-4xl ${rating >= 7 ? 'text-green-500' : rating >= 5 ? 'text-yellow-500' : 'text-gray-500'}`}>
              {rating}
            </span>
          </div>
          <div className="flex justify-center mb-4">
            {[...Array(10)].map((_, index) => (
              <button
                key={index}
                onClick={() => handleStarClick(index + 1)}
                className={`${rating >= index + 1 ? 'text-yellow-500' : 'text-gray-500'}`}
              >
                <span className="text-6xl">★</span>
              </button>
            ))}
          </div>
          <button
            onClick={handleSubmitRating}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Отправить оценку
          </button>
        </div>
      )}
    </div>
  );
};

export default RatingPopup;
