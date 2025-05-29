import { useState, useEffect } from "react";
import io from "socket.io-client";

const socketUrl = "http://localhost:5000";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io(socketUrl);
    setSocket(socketInstance);
 
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
};
