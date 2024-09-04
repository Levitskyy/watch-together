import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from 'react-router-dom';
import PlayerFrame from "../components/PlayerFrame";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const serverURL = 'ws://localhost:8000';

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
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);

  useEffect(() => {
    const connect = () => {
      socketRef.current = new WebSocket(`${serverURL}/api/room/${roomId}`);

      socketRef.current.onopen = () => {
        console.log('Connected to WebSocket server');
        reconnectAttemptsRef.current = 0; 
      };

      socketRef.current.onmessage = (event) => {
        setMessages((prevMessages) => [...prevMessages, event.data]);
      };

      socketRef.current.onerror = (error) => {
        console.log(error.message);
      };

      socketRef.current.onclose = () => {
        console.log('Disconnected from WebSocket server');
        reconnect();
      };
    };

    const reconnect = () => {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectAttemptsRef.current += 1;
      const delay = Math.min(2 ** reconnectAttemptsRef.current * 1000, 30000);
      reconnectTimeoutRef.current = setTimeout(connect, delay);
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeoutRef.current);
      socketRef.current.close();
    };
  }, [roomId]);

  const sendMessageToServer = (message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log('emitted');
      socketRef.current.send(message);
    }
  };

  const sendMessageToPlayer = (message) => {
    if (playerRef.current) {
      playerRef.current.sendMessageToIframe(message);
    }
  };

  const episodeUpdateHandler = (data) => {
    console.log(data);
  };

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
      <button
        onClick={setTranslation}
        className="bg-neutral-500"
      >
        setTrans
      </button>
      <div className="container mx-auto flex justify-center w-3/4 bg-neutral-800 rounded mt-8" id="videoplayer">
        <PlayerFrame
          ref={playerRef}
          animeId={animeId}
          animeKind={animeKind}
          translation={selectedTranslation}
          link={link}
          onEpisodeUpdate={episodeUpdateHandler}
        />
      </div>
      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
        <button
          onClick={() => sendMessageToServer('Hello server!!')}
          className="bg-neutral-500"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default WatchRoom;
