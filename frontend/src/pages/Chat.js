import React, { useEffect, useState } from "react";
import axios from "axios";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [agreement, setAgreement] = useState(null);

  const token = localStorage.getItem("token");
  const fallbackImageUrl = "https://www.example.com/default-profile-pic.jpg";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("https://skill-exchange-06xf.onrender.com/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(data);
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };

    const fetchChats = async () => {
      try {
        const { data } = await axios.get("https://skill-exchange-06xf.onrender.com/api/chat/my-chats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChats(data);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };

    if (token) {
      fetchUser();
      fetchChats();
    }
  }, [token]);

  const getOtherUser = (chat) => {
    return chat?.participants?.find((user) => user._id !== currentUser?._id);
  };

  const selectChat = async (chat) => {
    setSelectedChat(chat);
    try {
      const { data: msgs } = await axios.get(`https://skill-exchange-06xf.onrender.com/api/chat/chat/${chat._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(msgs);

      const { data: agr } = await axios.get(
        `https://skill-exchange-06xf.onrender.com/api/agreement/check/${chat._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAgreement(agr);
    } catch (err) {
      console.error("Error fetching chat or agreement:", err);
      setAgreement(null);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !currentUser) return;
    const otherUser = getOtherUser(selectedChat);
    if (!otherUser) return;

    try {
      const { data } = await axios.post(
        "https://skill-exchange-06xf.onrender.com/api/chat/send",
        {
          otherUserId: otherUser._id,
          message: newMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages((prev) => [...prev, data.newMessage]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const handleAgreement = async () => {
    try {
      const { data } = await axios.post(
        "https://skill-exchange-06xf.onrender.com/api/agreement",
        {
          chatId: selectedChat._id,
          userId: currentUser._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAgreement(data);
    } catch (err) {
      console.error("Agreement error:", err);
    }
  };

  const giveCredit = async () => {
    try {
      const otherUser = getOtherUser(selectedChat);
      await axios.post(
        "https://skill-exchange-06xf.onrender.com/api/credits/give",
        {
          toUserId: otherUser._id,
          amount: 50,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("50 Skill Credits Given Successfully!");
    } catch (err) {
      console.error("Error giving credit:", err);
    }
  };

  const bothAgreed = agreement?.user1Agreed && agreement?.user2Agreed;

  return (
    <div className="chat-container" style={{ display: "flex", height: "80vh" }}>
      {/* Chat List */}
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
                src={otherUser?.profilePicture || fallbackImageUrl}
                alt="profile"
                style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }}
              />
              <span>{otherUser?.name || otherUser?.email || "User"}</span>
            </div>
          );
        })}
      </div>

      {/* Chat View */}
      <div style={{ width: "70%", padding: "20px", display: "flex", flexDirection: "column" }}>
        {selectedChat ? (
          <>
            {(() => {
              const selectedOtherUser = getOtherUser(selectedChat);
              return (
                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                  <img
                    src={selectedOtherUser?.profilePicture || fallbackImageUrl}
                    alt="profile"
                    style={{ width: "35px", height: "35px", borderRadius: "50%", marginRight: "10px" }}
                  />
                  <h3 style={{ margin: 0 }}>{selectedOtherUser?.name || "User"}</h3>
                </div>
              );
            })()}

            {agreement && (
              <div style={{ marginBottom: "10px", background: "#f0f0f0", padding: "10px", borderRadius: "8px" }}>
                <p>
                  <strong>Agreement:</strong>{" "}
                  {bothAgreed ? (
                    <span style={{ color: "green" }}>Both Agreed ✅</span>
                  ) : (
                    <span style={{ color: "orange" }}>Pending Agreement ⏳</span>
                  )}
                </p>
              </div>
            )}

            <div
              style={{
                flex: 1,
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "10px",
                overflowY: "auto",
              }}
            >
              {messages.length === 0 ? (
                <p style={{ color: "#999" }}>No messages yet. Say hi!</p>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      textAlign: msg.sender._id === currentUser._id ? "right" : "left",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        padding: "8px 12px",
                        borderRadius: "15px",
                        backgroundColor: msg.sender._id === currentUser._id ? "#dcf8c6" : "#f1f0f0",
                      }}
                    >
                      <strong>{msg.sender.name}</strong>
                      <div>{msg.content}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: "flex", marginTop: "10px" }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                style={{ flex: 1, padding: "10px" }}
              />
              <button onClick={sendMessage} style={{ padding: "10px 15px" }}>
                Send
              </button>
            </div>

            <div style={{ marginTop: "10px" }}>
              {bothAgreed ? (
                <button onClick={giveCredit} style={{ backgroundColor: "green", color: "white", padding: "10px" }}>
                  Give Credit
                </button>
              ) : (
                <button onClick={handleAgreement} style={{ backgroundColor: "#007bff", color: "white", padding: "10px" }}>
                  Agree to Work
                </button>
              )}
            </div>
          </>
        ) : (
          <h4 style={{ color: "#777" }}>Select a chat to start messaging</h4>
        )}
      </div>
    </div>
  );
};

export default Chat;
