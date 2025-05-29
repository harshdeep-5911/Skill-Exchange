import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token being sent:", token);

        if (!token) {
          alert("No token found. Please login again.");
          return;
        }

        const { data } = await axios.get(
          "https://skill-exchange-06xf.onrender.com/api/service-requests/my-requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Fetched requests:", data);
        setRequests(data.filter((req) => req.status === "pending"));
      } catch (err) {
        console.error("Error fetching requests:", err);
        alert("Failed to fetch requests");
      }
    };

    fetchRequests();
  }, []);

  const acceptRequest = async (requestId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Token is missing. Please log in again.");
      return;
    }

    try {
      const { data } = await axios.post(
        "https://skill-exchange-06xf.onrender.com/api/service-requests/accept",
        { requestId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.chatId) {
        navigate(`/chat?chatId=${data.chatId}`);
      } else {
        alert("Request accepted, but no chat created.");
      }
    } catch (error) {
      console.error("Failed to accept request:", error);
      alert("Failed to accept request.");
    }
  };

  const declineRequest = async (requestId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Token is missing. Please log in again.");
      return;
    }

    try {
      await axios.post(
        "https://skill-exchange-06xf.onrender.com/api/service-requests/decline",
        { requestId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );
      alert("Request declined.");
    } catch (error) {
      console.error("Error declining request:", error);
      alert("Failed to decline request.");
    }
  };

  return (
    <div>
      <h3>Pending Service Requests</h3>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul>
          {requests.map((request) => (
            <li key={request._id}>
              <p>
                Request from <strong>{request.fromUser?.name}</strong><br />
                Skills: {request.fromUser?.skills?.join(", ")}
              </p>
              <button onClick={() => acceptRequest(request._id)}>Accept</button>
              <button onClick={() => declineRequest(request._id)}>Decline</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Services;
