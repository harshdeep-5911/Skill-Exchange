import { useState, useEffect } from "react";
import io from "socket.io-client";

const socketUrl = "http://localhost:5000"; // Your backend URL

export const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io(socketUrl);
    setSocket(socketInstance);

    // Cleanup: Disconnect the socket when the component unmounts
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
};
