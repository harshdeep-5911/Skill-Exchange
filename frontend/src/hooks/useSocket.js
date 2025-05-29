import { useState, useEffect } from "react";
import io from "socket.io-client";

const socketUrl = "https://skill-exchange-06xf.onrender.com";

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
