import { useEffect, useState } from "react";
import { capitalize, formatDate } from "../../utils/utils";
import axiosInstance from "../axiosInstance";
import { serverURL } from "../../App";
import { Link } from "react-router-dom";

const CategoryButton = ({ clickHandler, text, isActive }) => {
    return (
        <button
            onClick={clickHandler}
            className={`py-1 mb-1 px-2 hover:bg-neutral-700 rounded text-neutral-400 text-left ${isActive ? 'bg-neutral-700' : 'bg-neutral-800'}`}
        >
            {text}
        </button>
    );
};

const ProfileAnimeCard = ({ markedAnime }) => {
    return (
        <Link to={`/anime/${markedAnime.anime.id}`} className="p-1 hover:bg-neutral-700 rounded">
            <div className="flex">
                <div className="w-16 mr-2 my-1 relative">
                    <img src={markedAnime.anime.poster_url} className="h-24 w-full rounded-lg"></img>
                </div>
                <div className="flex w-full justify-between">
                    <div className="flex-col">
                        <h2 className="text-neutral-200 text-lg">
                            {markedAnime.anime.title}
                        </h2>
                        <span className="text-neutral-400 text-base">
                            Добавлено {formatDate(markedAnime.updated_at)}
                        </span>
                    </div>
                    <div className="text-neutral-400 text-xl">
                        {markedAnime.rating ? markedAnime.rating : 'Не оценено'} ⭐
                    </div>
                </div>
            </div>
        </Link>
    );
}; 

const statusList = [
    { ru: 'оценено', en: 'rated' },
    { ru: 'смотрю', en: 'watching' },
    { ru: 'запланировано', en: 'planned' },
    { ru: 'брошено', en: 'dropped' },
    { ru: 'просмотрено', en: 'watched' },
    { ru: 'любимое', en: 'favorite' },
    { ru: 'пересматриваю', en: 'rewatching' },
    { ru: 'отложено', en: 'on_hold' }
];

function getEnglishStatus(ruStatus) {
    const status = statusList.find(item => item.ru === ruStatus);
    return status ? status.en : null;
}

const ProfileAnimes = () => {
    const [currentCategory, setCurrentCategory] = useState('rated');
    const [animeDict, setAnimeDict] = useState([]);
    // {
    //     anime: '',
    //     category: '',
    //     rating: '',
    // }

    useEffect(() => {
        const fetchMarkedAnimes = async () => {
            try {
                const response = await axiosInstance.get(`http://${serverURL}/api/animes/my/marked`);
                if (!response) {
                    console.error('Error getting marked animes');
                } else {
                    const data = response.data;
                    setAnimeDict(data);
                }
            } catch (error) {
                console.error('Error getting marked animes:', error);
            }
        };

        fetchMarkedAnimes();
    }, []);

    useEffect(() => {
        console.log(animeDict);
    }, [animeDict]);

    const handleCategoryClick = (category) => {
        setCurrentCategory(category);
    };

    return (
        <div className="flex gap-2">
            <div className="flex flex-col w-1/6 p-2 rounded bg-neutral-800 h-fit">
                {statusList.map((category) => (
                    <CategoryButton
                        text={capitalize(category.ru)}
                        clickHandler={() => handleCategoryClick(category.en)}
                        isActive={currentCategory === category.en}
                    />
                ))}
            </div>
            <div className="flex flex-col w-5/6 p-2 rounded bg-neutral-800">
                {animeDict
                    .filter((anime) =>
                        currentCategory === 'rated' ? anime.rating !== null : getEnglishStatus(anime.category) === currentCategory
                    )
                    .map((anime) => (
                        <ProfileAnimeCard key={anime.id} markedAnime={anime} />
                    ))}
                {animeDict
                    .filter((anime) =>
                        currentCategory === 'rated' ? anime.rating !== null : getEnglishStatus(anime.category) === currentCategory
                    ).length === 0 && (
                    <div className="h-full w-full flex items-center justify-center text-neutral-400">
                        Добавьте тайтлы в категорию
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileAnimes;
