import React, { useEffect, useState } from "react";
import axios from "axios";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [agreementAccepted, setAgreementAccepted] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        console.error("Token is missing");
        return;
      }

      try {
        const { data } = await axios.get("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(data);
      } catch (err) {
        console.error("Error fetching current user:", err.response?.data || err.message);
      }
    };

    const fetchChats = async () => {
      if (!token) {
        console.error("Token is missing");
        return;
      }

      try {
        const { data } = await axios.get("http://localhost:5000/api/chat/my-chats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setChats(data);
      } catch (error) {
        console.error("Error fetching chats:", error.response?.data || error.message);
      }
    };

    fetchUser();
    fetchChats();
  }, [token]);

  const selectChat = async (chat) => {
    setSelectedChat(chat);

    try {
      const { data } = await axios.get(`http://localhost:5000/api/chat/messages/${chat._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error.response?.data || error.message);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !currentUser) return;

    const otherUser = selectedChat.participants.find(
      (user) => user._id !== currentUser._id
    );

    if (!otherUser) {
      console.error("Could not identify the other user in the chat.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/chat/send",
        {
          otherUserId: otherUser._id,
          message: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prev) => [...prev, data.messages.at(-1)]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message);
    }
  };

  const getOtherUser = (chat) => {
    if (!chat || !chat.participants || !currentUser) return null;
    return chat.participants.find((user) => user._id !== currentUser._id);
  };

  const handleAgreement = () => {
    setAgreementAccepted(true);
    console.log("Agreement Accepted");
  };

  const fallbackImageUrl = "https://www.example.com/default-profile-pic.jpg";

  return (
    <div className="chat-container" style={{ display: "flex", height: "80vh" }}>
      <div style={{ width: "30%", borderRight: "1px solid #ccc", overflowY: "auto" }}>
        <h3 style={{ padding: "10px" }}>Chats</h3>
        {chats.map((chat) => {
          const otherUser = getOtherUser(chat);

          return (
            <div
              key={chat._id}
              onClick={() => selectChat(chat)}
              style={{
                padding: "10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                backgroundColor: selectedChat?._id === chat._id ? "#eee" : "#fff",
              }}
            >
              <img
                src={otherUser?.profilePic || fallbackImageUrl}
                alt="profile"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <span>{otherUser?.name || otherUser?.email || "User"}</span>
            </div>
          );
        })}
      </div>

      <div style={{ width: "70%", padding: "20px", display: "flex", flexDirection: "column" }}>
        {selectedChat ? (
          <>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <img
                src={getOtherUser(selectedChat)?.profilePic || fallbackImageUrl}
                alt="profile"
                style={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <h3 style={{ margin: 0 }}>
                {getOtherUser(selectedChat)?.name ||
                  getOtherUser(selectedChat)?.email ||
                  "User"}
              </h3>
            </div>

            <div
              style={{
                flex: 1,
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "10px",
                overflowY: "auto",
              }}
            >
              {messages.map((msg, idx) => (
                <div key={idx} style={{ marginBottom: "10px" }}>
                  <strong>{msg.sender === currentUser?.email ? "You" : "Them"}:</strong>{" "}
                  {msg.content}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", marginTop: "10px" }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message"
                style={{ flex: 1, marginRight: "10px", padding: "8px" }}
              />
              <button onClick={sendMessage}>Send</button>
            </div>

            {/* Agreement Button */}
            <div style={{ marginTop: "20px" }}>
              {!agreementAccepted && (
                <button onClick={handleAgreement} style={{ padding: "10px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px" }}>
                  Agree to Terms
                </button>
              )}
              {agreementAccepted && <p>Agreement Accepted</p>}
            </div>
          </>
        ) : (
          <p>Select a chat to start messaging</p>
        )}
      </div>
    </div>
  );
};

export default Chat;
