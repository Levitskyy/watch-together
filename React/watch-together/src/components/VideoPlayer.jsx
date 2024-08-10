import React, { useEffect, useRef, useState } from 'react';
import KinoboxPlayer from './KinoboxPlayer';

const VideoPlayer = ({ videoUrl }) => {
  const iframeRef = useRef(null);
  const [playerPaused, setPlayerPaused] = useState(true);

  useEffect(() => {
    const handleMessage = (event) => {
      // Обработка сообщений от iframe
      console.log('Received message:', event.data);
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const sendMessageToIframe = (message) => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(message, '*');
      console.log("MESSAGE: ", message);
    }
  };

  const handlePlayPause = () => {
    sendMessageToIframe({"api": "toggle"});
  };

  const handleRewind = () => {
    sendMessageToIframe({ type: 'rewind', seconds: 10 });
  };

  const handleForward = () => {
    sendMessageToIframe({ type: 'forward', seconds: 10 });
  };


  return (
    <div className="flex flex-col items-center w-full">
      <KinoboxPlayer kinopoiskId={'325'}/>
      <div className="flex mt-4 space-x-4">
        <button
          onClick={handlePlayPause}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Play/Pause
        </button>
        <button
          onClick={handleRewind}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Rewind 10s
        </button>
        <button
          onClick={handleForward}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Forward 10s
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
