import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const socket = io("https://skill-exchange-06xf.onrender.com");

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    skills: "",
    experience: "",
    portfolio: null,
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const skillsList = [
    "Web Development",
    "Graphic Design",
    "Data Science",
    "Content Writing",
    "Marketing",
  ];

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      navigate("/login");
    } else {
      setFormData((prev) => ({ ...prev, email: userEmail }));
    }

    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://skill-exchange-06xf.onrender.com/api/service-requests/my-requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRequests(response.data);
      } catch (error) {
        console.error("❌ Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, portfolio: e.target.files[0] });
  };

  const handleSendOTP = async () => {
    try {
      await axios.post("https://skill-exchange-06xf.onrender.com/api/users/send-otp", {
        email: formData.email,
      });
      setOtpSent(true);
      alert("OTP sent to your email!");
    } catch (error) {
      console.error("OTP Error:", error.response?.data || error.message);
      alert(
        "Error sending OTP: " +
          (error.response?.data?.message || "Unknown error")
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("skills", formData.skills);
    formDataToSend.append("experience", formData.experience);
    formDataToSend.append("portfolio", formData.portfolio);
    formDataToSend.append("otp", formData.otp);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not authenticated. Please log in again.");
        navigate("/login");
        return;
      }

      await axios.post(
        "https://skill-exchange-06xf.onrender.com/api/users/create-profile",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      socket.emit("skillUpdated");

      alert("Profile created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Profile creation error:",
        error.response?.data || error.message
      );
      alert(
        "Error creating profile: " +
          (error.response?.data?.message || "Unknown error")
      );
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://skill-exchange-06xf.onrender.com/api/service-requests/accept",
        { requestId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Request accepted!");
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error("❌ Accept Request Error:", error);
      alert("Error accepting request");
    }
  };

  return (
    <div className="profile-container">
      <form onSubmit={handleSubmit} className="profile-form">
        <h2>Create Your Profile</h2>

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} disabled />
        </div>

        <div className="form-group">
          <label>Skill</label>
          <select
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select your skill
            </option>
            {skillsList.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Years of Experience</label>
          <input
            type="text"
            name="experience"
            placeholder="Years of experience"
            value={formData.experience}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Portfolio (PDF/Image)</label>
          <input
            type="file"
            name="portfolio"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            required
            className="file-input"
          />
        </div>

        {!otpSent ? (
          <button type="button" onClick={handleSendOTP}>
            Send OTP
          </button>
        ) : (
          <div className="otp-input">
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={handleChange}
              required
            />
            <button type="submit">Create Profile</button>
          </div>
        )}
      </form>

      {}
      <div className="service-requests">
        <h3>Request History </h3>
        {requests.length === 0 ? (
          <p>No service requests found.</p>
        ) : (
          <ul>
            {requests.map((request) => (
              <li key={request._id}>
                <strong>From:</strong> {request.fromEmail}<br />
                <strong>Service:</strong> {request.serviceDetails}<br />
                <button onClick={() => acceptRequest(request._id)}>Accept</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Profile;
