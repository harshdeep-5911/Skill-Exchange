import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Services from "./pages/Services";
import SkillExchange from "./pages/SkillExchange";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useSocket } from "./hooks/useSocket"; // Custom hook for socket connection

const App = () => {
  const socket = useSocket();
  const [isSocketReady, setIsSocketReady] = useState(false);

  useEffect(() => {
    if (socket) {
      // Socket is ready
      setIsSocketReady(true);

      socket.on("openChat", ({ user1, user2 }) => {
        const myEmail = localStorage.getItem("userEmail");
        if (myEmail === user1 || myEmail === user2) {
          window.location.href = "/chat";
        }
      });

      socket.on("newServiceRequestNotification", ({ toEmail }) => {
        const myEmail = localStorage.getItem("userEmail");
        if (myEmail === toEmail) {
          alert("You have a new service request!");
        }
      });

      // Cleanup
      return () => {
        socket.off("openChat");
        socket.off("newServiceRequestNotification");
      };
    }
  }, [socket]);

  if (!isSocketReady) {
    return <div>Loading...</div>; // Render loading state until socket is ready
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/services" element={<Services />} />
        <Route path="/exchange" element={<SkillExchange />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
