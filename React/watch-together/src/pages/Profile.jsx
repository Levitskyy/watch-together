import axiosInstance from "../components/axiosInstance";
import { serverURL } from "../App";
import { useEffect, useState } from "react";
import ProfileAnimes from "../components/profile/ProfileAnimes";
import ProfileComments from "../components/profile/ProfileComments";
import ProfileFriends from "../components/profile/ProfileFriends";
import { capitalize } from "../utils/utils";

const ProfilePageButton = ({clickHandler, text, isActive}) => {
  return (
    <button
      className={`py-2 px-2 text-neutral-300 border-b-2 border-neutral-500 ${isActive ? 'border-opacity-100' : 'border-opacity-0'}`}
      onClick={clickHandler}
    >
      {text}
    </button>
  );
};

const Profile = () => {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('anime');

    const pfpUrl = `http://${serverURL}/api/static/img/pfp/default.jpg`;

    const profilePages = [
      {ru : 'аниме', en : 'anime'},
      {ru : 'комментарии', en : 'comments'},
      {ru : 'друзья', en : 'friends'},
    ];

    useEffect(() => {
        const handleProfile = async () => {
            try {
                const response = await axiosInstance.get(`http://${serverURL}/api/auth/me`);
                if (!response) {
                    console.error('Error getting me');
                } else {
                    const data = response.data;
                    setUsername(data.username);
                    setRole(data.role);
                }
            } catch (error) {
                console.error('Error getting me:', error);
            }
        };

        handleProfile();
    }, []);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    return (
        <div className="w-full min-h-screen bg-neutral-900 p-5">
            <div className="w-2/3 bg-neutral-800 rounded mx-auto flex">
                <div className="max-w-16">
                    <img src={pfpUrl} className="rounded m-2" alt="Profile"></img>
                </div>
                <div className="flex flex-col w-full ml-4">
                    <span className="text-slate-200 text-2xl my-2 ml-2">
                        {username}
                    </span>
                    <div className="flex gap-4 text-slate-200 justify-start">
                      {profilePages.map((page) => (
                        <ProfilePageButton
                          clickHandler={() => setSelectedCategory(page.en)}
                          text={capitalize(page.ru)}
                          isActive={selectedCategory === page.en}
                        />
                      ))}
                    </div>
                </div>
            </div>
            <div className="mt-4 w-2/3 mx-auto">
                {selectedCategory === 'anime' && <ProfileAnimes />}
                {selectedCategory === 'comments' && <ProfileComments />}
                {selectedCategory === 'friends' && <ProfileFriends />}
            </div>
        </div>
    );
};

export default Profile;
