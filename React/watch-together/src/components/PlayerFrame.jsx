import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { serverURL } from '../App';
import axios from 'axios';

const PlayerFrame = forwardRef(({ animeId, animeKind, translation, link, onEpisodeUpdate, onToggle, onSeek }, ref) => {
    const [episodes, setEpisodes] = useState(null);
    const [uniqueVoices, setUniqueVoices] = useState([]);
    const [uniqueSubs, setUniqueSubs] = useState([]);
    const [streamLink, setStreamLink] = useState(link);
    const [showVoiceList, setShowVoiceList] = useState(true);
    const [showSubList, setShowSubList] = useState(false);
    const [voiceCount, setVoiceCount] = useState(0);
    const [subCount, setSubCount] = useState(0);
    const [selectedTranslation, setSelectedTranslation] = useState(translation);
    const [translationEps, setTranslationEps] = useState([]);

    const playerRef = useRef(null);
    const iframeRef = useRef(null);
    const translationsRef = useRef(null);
    const buttonContainerRef = useRef(null);
    const episodesContainerRef = useRef(null); // Реф для контейнера с эпизодами
    const currentSeconds = useRef(0);
    const [initialPlayerHeight, setInitialPlayerHeight] = useState(0);

    useEffect(() => {
        axios.get(`http://${serverURL}/api/episodes/title/${animeId}`)
            .then((response) => {
                const data = response.data;
                let filteredEpisodes = null;
                console.log(animeKind);
                if (animeKind === "tv") {
                    filteredEpisodes = data.filter(episode => episode.season !== 0);
                } else {
                    filteredEpisodes = data;
                }
                setEpisodes(filteredEpisodes);
    
                const translationsSet = new Set();
                const voiceSet = new Set();
                const subSet = new Set();
    
                data.forEach(episode => {
                    const translationKey = `${episode.translation_title}:::${episode.translation_type}`;
                    translationsSet.add(translationKey);
    
                    if (episode.translation_type === 'voice') {
                        voiceSet.add(translationKey);
                    } else if (episode.translation_type === 'subtitles') {
                        subSet.add(translationKey);
                    }
                });
    
                const uniqueVoicesArray = Array.from(voiceSet).map(item => {
                    const [title, type] = item.split(':::');
                    return { title, type };
                });
    
                const uniqueSubsArray = Array.from(subSet).map(item => {
                    const [title, type] = item.split(':::');
                    return { title, type };
                });
    
                setUniqueVoices(uniqueVoicesArray);
                setUniqueSubs(uniqueSubsArray);
                setVoiceCount(voiceSet.size);
                setSubCount(subSet.size);
            })
            .catch((error) => console.error('Error fetching episodes:', error));
    }, [animeId, animeKind]);

    useEffect(() => {
        if (translation) {
            return;
        }

        if (uniqueVoices.length > 0) {
            setSelectedTranslation(uniqueVoices[0].title);
        }
    }, [uniqueVoices]);

    useEffect(() => {
        if (translation) {
            setSelectedTranslation(translation);
        }
        if (link) {
            setStreamLink(link);
        }
    }, [translation, link]);

    useEffect(() => {
        if (streamLink) {
            const data = {
                animeId: animeId,
                animeKind: animeKind,
                translation: selectedTranslation,
                link: streamLink
            }
            if (onEpisodeUpdate) {
                onEpisodeUpdate(data);
            }
        }
    }, [streamLink]);

    useEffect(() => {
        if (playerRef.current && translationsRef.current) {
            const playerHeight = playerRef.current.clientHeight;
            const buttonContainerHeight = buttonContainerRef.current.clientHeight;

            if (initialPlayerHeight === 0) {
                setInitialPlayerHeight(playerHeight);
            }

            translationsRef.current.style.maxHeight = `${initialPlayerHeight - buttonContainerHeight}px`;
        }
    }, [episodes, initialPlayerHeight]);

    useEffect(() => {
        if (episodes) {
            const filteredEpisodes = episodes.filter(episode => episode.translation_title === selectedTranslation);
            setTranslationEps(filteredEpisodes);
            if (filteredEpisodes.length > 0) {
                if (link) {
                    setStreamLink(link);
                }
                else {
                    setStreamLink(filteredEpisodes[0].url);
                }
            }
        }
    }, [selectedTranslation, episodes]);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data.key === 'kodik_player_play') {
                const data = {event: 'toggle', value: 'play'};
                if (onToggle) {
                    onToggle(data);
                }
            }
            else if (event.data.key === 'kodik_player_pause') {
                const data = {event: 'toggle', value: 'pause'};
                if (onToggle) {
                    onToggle(data);
                }
            }
            else if (event.data.key === 'kodik_player_seek') {
                const data = {event: 'seek', value: Math.round(event.data.value.time)};
                if (onSeek) {
                    onSeek(data);
                }
            }
            else if (event.data.key === 'kodik_player_time_update') {
                currentSeconds.current = event.data.value;
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    const handlePrevEpisode = () => {
        if (episodesContainerRef.current) {
            episodesContainerRef.current.scrollBy({
                left: -episodesContainerRef.current.clientWidth / 3, // Прокручиваем на 1/3 ширины контейнера
                behavior: 'smooth',
            });
        }
    };

    const handleNextEpisode = () => {
        if (episodesContainerRef.current) {
            episodesContainerRef.current.scrollBy({
                left: episodesContainerRef.current.clientWidth / 3, // Прокручиваем на 1/3 ширины контейнера
                behavior: 'smooth',
            });
        }
    };

    const sendMessageToIframe = (message) => {
        const iframe = iframeRef.current;
        if (iframe) {
            iframe.contentWindow.postMessage(message, '*');
            console.log('Posted message to IFRAME:', message);
        }
    };

    useImperativeHandle(ref, () => ({
        sendMessageToIframe,
        currentSeconds,
    }));

    return (
        <div className="w-full">
            <div className="flex justify-left w-full">
                <div className="w-3/4 relative" ref={playerRef} style={{ paddingBottom: '42.2%' }}>
                    <iframe
                        title="kodik-player"
                        ref={iframeRef}
                        className="rounded w-full h-full absolute top-0 left-0"
                        id="kodik-player"
                        src={streamLink + '?translations=false'}
                        allowFullScreen
                    />
                </div>
                <div className="w-1/4 bg-neutral-800 rounded flex flex-col">
                    <div className="w-full flex items-center" ref={buttonContainerRef}>
                        <button
                            className={`border-r text-white py-2 px-4 hover:bg-neutral-600 transition duration-300 w-1/2 ${
                                showVoiceList ? 'bg-neutral-600' : 'bg-neutral-800'
                            }`}
                            onClick={() => {
                                setShowSubList(false);
                                setShowVoiceList(true);
                            }}
                        >
                            <div className="flex justify-center items-center gap-1">
                                <span className="text-neutral-400 text-base">Озвучка</span>
                                <span className="text-neutral-500 text-sm">{voiceCount}</span>
                            </div>
                        </button>
                        <button
                            className={`text-white py-2 px-4 hover:bg-neutral-600 transition duration-300 w-1/2 ${
                                showSubList ? 'bg-neutral-600' : 'bg-neutral-800'
                            }`}
                            onClick={() => {
                                setShowVoiceList(false);
                                setShowSubList(true);
                            }}
                        >
                            <div className="flex justify-center items-center gap-1">
                                <span className="text-neutral-400 text-base">Субтитры</span>
                                <span className="text-neutral-500 text-sm">{subCount}</span>
                            </div>
                        </button>
                    </div>
                    <div className="flex-grow overflow-y-scroll" ref={translationsRef}>
                        {showVoiceList && (
                            <div>
                                {uniqueVoices.map((voice) => (
                                    <button
                                        key={voice.title}
                                        className={`w-full p-2 text-white transition duration-300 ${
                                            selectedTranslation === voice.title ? 'bg-green-600' : 'bg-neutral-800 hover:bg-neutral-600 '
                                        }`}
                                        onClick={() => {
                                            setSelectedTranslation(voice.title);
                                            console.log("setted trans");
                                        }}
                                    >
                                        {voice.title}
                                    </button>
                                ))}
                            </div>
                        )}
                        {showSubList && (
                            <div>
                                {uniqueSubs.map((sub) => (
                                    <button
                                        key={sub.title}
                                        className={`w-full p-2 text-white transition duration-300 ${
                                            selectedTranslation === sub.title ? 'bg-green-600' : 'bg-neutral-800 hover:bg-neutral-600'
                                        }`}
                                        onClick={() => setSelectedTranslation(sub.title)}
                                    >
                                        {sub.title.replace('.Subtitles', '')}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center w-full bg-neutral-800 h-12 rounded px-2 gap-2">
                <button
                    className="text-white bg-neutral-800 hover:bg-neutral-700 transition duration-300 px-3 py-1 rounded"
                    onClick={handlePrevEpisode}
                >
                    ◀
                </button>
                <div
                    className="flex space-x-2 overflow-x-auto no-scrollbar"
                    ref={episodesContainerRef}
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {translationEps &&
                        translationEps.map((episode, index) => (
                            <button
                                key={episode.url}
                                className={`px-4 py-2 text-white rounded transition duration-300 ${
                                    streamLink === episode.url ? 'bg-green-600' : 'bg-neutral-700 hover:bg-neutral-500'
                                }`}
                                onClick={() => setStreamLink(episode.url)}
                            >
                                <div className="flex justify-center items-center gap-2">
                                    <span className="">Эпизод</span>
                                    <span className="">{episode.number}</span>
                                </div>
                            </button>
                        ))}
                </div>
                <button
                    className="text-white bg-neutral-800 hover:bg-neutral-700 transition duration-300 px-3 py-1 rounded"
                    onClick={handleNextEpisode}
                >
                    ▶
                </button>
            </div>
        </div>
    );
});

export default PlayerFrame;
