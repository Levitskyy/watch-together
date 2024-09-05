import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from 'react-router-dom';
import PlayerFrame from "../components/PlayerFrame";
import WebSocketClient from "../components/WebSocketClient";
import { serverURL } from "../App";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}


const WatchRoom = () => {
  const { roomId } = useParams();
  const query = useQuery();
  const initAnimeId = query.get('animeId');
  const initAnimeKind = query.get('animeKind');
  const [anime, setAnime] = useState(null);
  const [animeId, setAnimeId] = useState(initAnimeId);
  const [animeKind, setAnimeKind] = useState(initAnimeKind);
  const [selectedTranslation, setSelectedTranslation] = useState(null);
  const [link, setLink] = useState(null);
  const [messages, setMessages] = useState([]);

  const playerRef = useRef(null);
  const socketClientRef = useRef(null);
  const lastCallTimeRef = useRef(0);
  const lastToggleTimeRef = useRef(0);

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
    const JSONdata = JSON.stringify(data);
    sendMessageToServer(JSONdata);
  };

  const handlePlayerToggle = (data) => {
    const JSONdata = JSON.stringify(data);
    sendMessageToServer(JSONdata);
  };

  const handlePlayerSeek = (data) => {
    const JSONdata = JSON.stringify(data);
    sendMessageToServer(JSONdata);
  };

  useEffect(() => {
    socketClientRef.current = new WebSocketClient(`ws://${serverURL}/api/room/${roomId}`);

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
          setAnimeId(data.value.animeId);
          setAnimeKind(data.value.animeKind);
          setSelectedTranslation(data.value.translation);
          setLink(data.value.link);
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
      <div>Loading...</div>
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
