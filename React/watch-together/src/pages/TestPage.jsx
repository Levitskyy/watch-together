import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from 'react-router-dom';

const serverURL = 'ws://localhost:8000/api/room/ws';

const TestPage = () => {

    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketInstance = new WebSocket(serverURL);
        setSocket(socketInstance);

        // listen for events emitted by the server

        socketInstance.onopen = () => {
          console.log('Connected to server');
        };

        socketInstance.onmessage = (event) => {
          console.log(`Received message: ${event.data}`);
        };

        socketInstance.onclose = () => {
          console.log('Disconnected from server');
        };

        socketInstance.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        return () => {
          if (socketInstance) {
            socketInstance.close();
          }
        };
      }, []);

    return (
        <div className="w-full bg-neutral-900 text-white min-h-screen pb-16">
            <span>Test</span>
        </div>
    );
};

export default TestPage;
