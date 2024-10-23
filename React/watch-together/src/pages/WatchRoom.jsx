import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from 'react-router-dom';
import PlayerFrame from "../components/PlayerFrame";
import WebSocketClient from "../components/WebSocketClient";
import { serverURL } from "../App";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../components/AuthProvider";
import { jwtDecode } from "jwt-decode";
import { nanoid } from 'nanoid'

function useQuery() {
  return new URLSearchParams(useLocation().search);
}


const WatchRoom = () => {
  const { roomId } = useParams();
  const { isAuthenticated } = useAuth();
  const query = useQuery();
  const initAnimeId = query.get('animeId');
  const initAnimeKind = query.get('animeKind');
  const [anime, setAnime] = useState(null);
  const [animeId, setAnimeId] = useState(initAnimeId);
  const [animeKind, setAnimeKind] = useState(initAnimeKind);
  const [selectedTranslation, setSelectedTranslation] = useState(null);
  const [link, setLink] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState("");

  const playerRef = useRef(null);
  const userIdRef = useRef(null);
  const socketClientRef = useRef(null);
  const lastCallTimeRef = useRef(0);
  const lastToggleTimeRef = useRef(0);
  const lastStateTimeRef = useRef(0);

  function addIdToMessage(data) {
    data = { ...data, "user_id": userIdRef.current};
    return data;
  };

  const updateId = () => {
    const token = localStorage.getItem("token");
    if (token) {
      let userName = null;
      
      const decoded = jwtDecode(token);
      userName = decoded.sub;
      
      if (userName) {
        setUserId(userName);
      }
    } else {
      const user_id = localStorage.getItem("user_id");
      if (user_id) {
        setUserId(user_id);
      } else {
        const new_user_id = nanoid();
        localStorage.setItem("user_id", new_user_id);
        setUserId(new_user_id);
      }
    }
  };

  const sendMessageToServer = (message) => {
    if (socketClientRef.current) {
      socketClientRef.current.send(message);
    }
  };

  const sendMessageToPlayer = (message) => {
    if (playerRef.current) {
      playerRef.current.sendMessageToIframe(message);
    }
  };

  const episodeUpdateHandler = (data) => {
    data = {event: 'episodeUpdate', value: data};
    data = addIdToMessage(data);
    const JSONdata = JSON.stringify(data);
    sendMessageToServer(JSONdata);
  };

  const handlePlayerToggle = (data) => {
    data = addIdToMessage(data);
    const JSONdata = JSON.stringify(data);
    sendMessageToServer(JSONdata);
  };

  const handlePlayerSeek = (data) => {
    data = addIdToMessage(data);
    const JSONdata = JSON.stringify(data);
    sendMessageToServer(JSONdata);
  };

  // useEffect(() => {
    
  // }, []);

  useEffect(() => {
    userIdRef.current = userId
  }, [userId]);

  useEffect(() => {
    socketClientRef.current = new WebSocketClient(`ws://${serverURL}/api/room/${roomId}`);
    updateId();
    socketClientRef.current.setOnMessageCallback((message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      let data = null;
      try {
        data = JSON.parse(message);
      } catch (e) {

      }
      if (data) {
        const currentTime = Date.now();
        if (data.value === 'play') {
          const playerMessage = {key: 'kodik_player_api', value: {method: 'play'}};
          const timeSinceLastCall = currentTime - lastCallTimeRef.current;

          if (timeSinceLastCall >= 300) {
            sendMessageToPlayer(playerMessage);
            lastToggleTimeRef.current = currentTime;
          }
        }
        else if (data.value === 'pause') {
          const playerMessage = {key: 'kodik_player_api', value: {method: 'pause'}};
          const timeSinceLastCall = currentTime - lastCallTimeRef.current;
          
          if (timeSinceLastCall >= 300) {
            sendMessageToPlayer(playerMessage);
            lastToggleTimeRef.current = currentTime;
          }
        }
        else if (data.event === 'seek') {
          const playerMessage = {key: 'kodik_player_api', value: {method: 'seek', seconds: data.value}};
          const diff = Math.abs(playerRef.current.currentSeconds.current - data.value);
          console.log('diff ' + diff);

          const timeSinceLastCall = currentTime - lastCallTimeRef.current;

          if (diff > 3 && timeSinceLastCall >= 300) {
            sendMessageToPlayer(playerMessage);
            lastCallTimeRef.current = currentTime;
          }
        }
        else if (data.event === 'state') {

          const timeSinceLastCall = currentTime - lastStateTimeRef.current;

          if (timeSinceLastCall >= 300) {
            setAnimeId(data.value.animeId);
            setAnimeKind(data.value.animeKind);
            setSelectedTranslation(data.value.translation);
            setLink(data.value.link);
          }
        }
      }
    });

    socketClientRef.current.connect();

    return () => {
      socketClientRef.current.close();
    };
  }, [roomId]);


  const data = {
    translation: "MiraiDUB",
    link: "//kodik.info/seria/206688/dedcac933b1d54b2b69a40ae17ab1391/720p"
  };

  const setTranslation = () => {
    setSelectedTranslation(data.translation);
    setLink(data.link);
  };

  if (!animeId || !animeKind) {
    return (
      <div className="w-full h-full bg-neutral-800">
        <LoadingSpinner/>
      </div>
    );
  }

  return (
    <div className="w-full bg-neutral-900 text-white min-h-screen pb-16">
      <h1>Watch Room</h1>
      <p>Room ID: {roomId}</p>
      <p>Anime ID: {animeId}</p>
      <p>Trans: {selectedTranslation}</p>
      <div className="container mx-auto flex justify-center w-3/4 bg-neutral-800 rounded mt-8" id="videoplayer">
        <PlayerFrame
          ref={playerRef}
          animeId={animeId}
          animeKind={animeKind}
          translation={selectedTranslation}
          link={link}
          onEpisodeUpdate={episodeUpdateHandler}
          onToggle={handlePlayerToggle}
          onSeek={handlePlayerSeek}
        />
      </div>
    </div>
  );
};

export default WatchRoom;
