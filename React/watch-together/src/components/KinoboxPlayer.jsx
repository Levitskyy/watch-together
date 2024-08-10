import React, { useEffect, useRef, useState } from 'react';

const KinoboxPlayer = ({ kinopoiskId }) => {
  const playerRef = useRef(null);
  const [iframe, setIframe] = useState(null);

  useEffect(() => {
    // Функция для загрузки внешнего скрипта
    const loadScript = (src, callback) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = callback;
      document.body.appendChild(script);
    };

    // Функция для инициализации плеера
    const initializePlayer = () => {
      if (window.kbox) {
        window.kbox(playerRef.current, {
            search: { 
                kinopoisk: kinopoiskId 
            }, 
            menu: {
                enable: false
            },
            notFoundMessage: "Видео не найдено.",
            player: {
                alloha: {
                    enable: true,
                    position: 1
                }
            }
        });
      }
      // Наблюдатель за изменениями в DOM
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.tagName === 'IFRAME' && node.classList.contains('kinobox_iframe')) {
              setIframe(node);
              observer.disconnect(); // Отключаем наблюдатель после добавления iframe
            }
          });
        });
      });

      // Наблюдение за изменениями внутри playerRef
      observer.observe(playerRef.current, { childList: true, subtree: true });
    };

    // Загрузка скрипта и инициализация плеера
    loadScript('https://kinobox.tv/kinobox.min.js', initializePlayer);

    // Очистка при размонтировании компонента
    return () => {
      if (playerRef.current) {
        playerRef.current.innerHTML = '';
      }
    };
  }, [kinopoiskId]);

    const sendMessageToIframe = (message) => {
        if (iframe) {
        iframe.contentWindow.postMessage(message, '*');
        console.log("MESSAGE: ", message);
        }
    };

    const handlePlayPause = () => {
        sendMessageToIframe({"api": "toggle"});
    };

  return (
    <div className="flex mt-4 space-x-4">
        <div ref={playerRef} className="kinobox_player w-full">
        </div>
        <button
          onClick={handlePlayPause}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Play/Pause
        </button>
    </div>
  )
};

export default KinoboxPlayer;
