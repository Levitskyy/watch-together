

class WebSocketClient {
    constructor(url) {
      this.url = url;
      this.socket = null;
      this.reconnectTimeout = null;
      this.reconnectAttempts = 0;
      this.onMessageCallback = null;
      this.onOpenCallback = null;
    }
  
    connect() {
      this.socket = new WebSocket(this.url);
  
      this.socket.onopen = () => {
        console.log('Connected to WebSocket server');
        this.reconnectAttempts = 0; 
        if (this.onOpenCallback) {
          this.onOpenCallback();
        }
      };
  
      this.socket.onmessage = (event) => {
        if (this.onMessageCallback) {
          this.onMessageCallback(event.data);
        }
      };
  
      this.socket.onerror = (error) => {
        console.log(error.message);
      };
  
      this.socket.onclose = () => {
        console.log('Disconnected from WebSocket server');
        this.reconnect();
      };
    }
  
    reconnect() {
      clearTimeout(this.reconnectTimeout);
      this.reconnectAttempts += 1;
      const delay = Math.min(2 ** this.reconnectAttempts * 1000, 30000); 
      this.reconnectTimeout = setTimeout(() => this.connect(), delay);
    }
  
    send(message) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(message);
      }
    }
  
    close() {
      clearTimeout(this.reconnectTimeout);
      if (this.socket) {
        this.socket.close();
      }
    }
  
    setOnMessageCallback(callback) {
      this.onMessageCallback = callback;
    }
  
    setOnOpenCallback(callback) {
      this.onOpenCallback = callback;
    }
  }
  
  export default WebSocketClient;
  