import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!userEmail) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/users/profile/${userEmail}`
        );
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile. Please try again later.");
      }
    };

    fetchProfile();
  }, [userEmail, navigate]);

  const handleEdit = () => {
    navigate("/profile"); // This should lead to the profile page with form
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {profile ? (
        <div className="profile-card">
          <img
            src={profile.portfolio || "default-avatar.png"}
            alt="Profile"
            className="profile-avatar"
          />
          <h3>{profile.name}</h3>
          <p>Email: {profile.email}</p>
          <p>Skills: {profile.skills.join(", ")}</p>
          <p>Experience: {profile.experience} years</p>

          <button
            onClick={handleEdit}
            className="edit-button"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Dashboard;
