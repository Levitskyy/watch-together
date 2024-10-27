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

const sortList = [
    { ru: 'По рейтингу', en: 'rating' },
    { ru: 'По дате добавления', en: 'date' },
    { ru: 'По названию', en: 'name' },
];

const ascList = [
    { ru: 'По возрастанию', en: 'asc' },
    { ru: 'По убыванию', en: 'desc' },
];

function getEnglishStatus(ruStatus) {
    const status = statusList.find(item => item.ru === ruStatus);
    return status ? status.en : null;
}

const ProfileAnimes = () => {
    const [currentCategory, setCurrentCategory] = useState('rated');
    const [sortAsc, setSortAsc] = useState('desc');
    const [currentSort, setCurrentSort] = useState('rating');
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

    const handleSortClick = (sort) => {
        setCurrentSort(sort);
    };

    const handleAscClick = (asc) => {
        setSortAsc(asc);
    };

    const getSort = (sortName, asc) => {
        const sort = (a, b) => {
            if (sortName === 'rating') {
                const c = (a.rating - b.rating);
                console.log("rating + " + c);
                return (asc === 'asc' ? c : -c);
            }
            if (sortName === 'name') {
                const c = ('' + a.anime.title.localeCompare(b.anime.title));
                console.log("name + " + c);
                return (asc === 'asc' ? c : -c);
            }
            // doesn't consider time, just date
            if (sortName === 'date') {
                a = a.updated_at.split('T')[0].split('.').reverse().join('');
                b = b.updated_at.split('T')[0].split('.').reverse().join('');
                const c = a.localeCompare(b);
                return (asc === 'asc' ? c : -c);
            }
        };

        return sort;
    };

    return (
        <div className="flex gap-2">
            <div className="flex flex-col w-1/6 p-2 rounded bg-neutral-800 h-fit">
                <div className="flex flex-col w-full">
                    {statusList.map((category) => (
                        <CategoryButton
                            text={capitalize(category.ru)}
                            clickHandler={() => handleCategoryClick(category.en)}
                            isActive={currentCategory === category.en}
                        />
                    ))}
                </div>
                <div className="flex my-2">
                    <h2 className="text-neutral-300">Сортировка</h2>
                </div>
                <div className="flex flex-col w-full">
                    {sortList.map((sort) => (
                        <CategoryButton
                            text={capitalize(sort.ru)}
                            clickHandler={() => handleSortClick(sort.en)}
                            isActive={currentSort === sort.en}
                        />
                    ))}
                </div>
                <div className="border-b border-neutral-400 w-full my-2"/>
                <div className="flex flex-col w-full">
                    {ascList.map((asc) => (
                        <CategoryButton
                            text={capitalize(asc.ru)}
                            clickHandler={() => handleAscClick(asc.en)}
                            isActive={sortAsc === asc.en}
                        />
                    ))}
                </div>
            </div>
            <div className="flex flex-col w-5/6 p-2 rounded bg-neutral-800">
                {animeDict
                    .filter((anime) =>
                        currentCategory === 'rated' ? anime.rating !== null : getEnglishStatus(anime.category) === currentCategory
                    )
                    .sort(getSort(currentSort, sortAsc))
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
