import React, { useState, useEffect } from "react";
import axios from "axios";

const Chat = ({ otherUserEmail }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [agreementAccepted, setAgreementAccepted] = useState(false);

  useEffect(() => {
    const loadChat = async () => {
      const { data } = await axios.post("http://localhost:5000/api/chat/get-or-create", 
        { otherUserEmail },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setMessages(data.messages);
    };
    if (otherUserEmail) loadChat();
  }, [otherUserEmail]);

  const sendMessage = async () => {
    if (!newMsg) return;
    const { data } = await axios.post("http://localhost:5000/api/chat/send", 
      { otherUserEmail, message: newMsg },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    setMessages(data.messages);
    setNewMsg("");
  };

  const handleAgreement = () => {
    setAgreementAccepted(true);
    console.log("Agreement Accepted");
  };

  return (
    <div>
      <h2>Chat with {otherUserEmail}</h2>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.sender === otherUserEmail ? "left-msg" : "right-msg"}>
            <strong>{msg.sender}</strong>: {msg.content}
          </div>
        ))}
      </div>
      <input 
        type="text" 
        value={newMsg} 
        onChange={(e) => setNewMsg(e.target.value)} 
        placeholder="Type your message"
      />
      <button onClick={sendMessage}>Send</button>

      {/* Agreement Button */}
      <div style={{ marginTop: "20px" }}>
        {!agreementAccepted && (
          <button onClick={handleAgreement} style={{ padding: "10px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px" }}>
            Agree to Terms
          </button>
        )}
        {agreementAccepted && <p>Agreement Accepted</p>}
      </div>
    </div>
  );
};

export default Chat;
