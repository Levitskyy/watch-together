import { useEffect, useState } from "react";
import { capitalize } from "../../utils/utils";
import axiosInstance from "../axiosInstance";
import { serverURL } from "../../App";

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

const ProfileAnimes = () => {
    const [currentCategory, setCurrentCategory] = useState('rated');
    const [animeDict, setAnimeDict] = useState(null);
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
            <div className="flex flex-col w-1/6 p-2 rounded bg-neutral-800">
                {statusList.map((category) => (
                    <CategoryButton
                        text={capitalize(category.ru)}
                        clickHandler={() => handleCategoryClick(category.en)}
                        isActive={currentCategory === category.en}
                    />
                ))}
            </div>
            <div className="flex flex-col w-5/6 p-2 rounded bg-neutral-800">
                
            </div>
        </div>
    );
};

export default ProfileAnimes;
