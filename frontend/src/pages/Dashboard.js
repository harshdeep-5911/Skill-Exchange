import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [credit, setCredit] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userEmail) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`https://skill-exchange-06xf.onrender.com/api/users/profile/${userEmail}`);
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile. Please try again later.");
      }
    };

    const fetchCredit = async () => {
      try {
        const { data } = await axios.get("https://skill-exchange-06xf.onrender.com/api/credits/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCredit(data.totalCredits);
      } catch (err) {
        console.error("Error fetching credit:", err);
      }
    };

    fetchProfile();
    fetchCredit();
  }, [userEmail, navigate, token]);

  const handleEdit = () => {
    navigate("/profile");
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {profile ? (
        <div className="profile-card">
          <img src={profile.portfolio || "default-avatar.png"} alt="Profile" className="profile-avatar" />
          <h3>{profile.name}</h3>
          <p>Email: {profile.email}</p>
          <p>Skills: {profile.skills.join(", ")}</p>
          <p>Experience: {profile.experience} years</p>
          <p><strong>Total Skill Credits:</strong> {credit ?? "Loading..."}</p>
          <button onClick={handleEdit} className="edit-button">
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
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [name, setName] = useState("");
//   const [bio, setBio] = useState("");
//   const [profilePic, setProfilePic] = useState(null);
//   const [preview, setPreview] = useState(null);

//   const token = localStorage.getItem("token");

//   // Fetch profile data
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUser(res.data);
//         setName(res.data.name || "");
//         setBio(res.data.bio || "");
//         setPreview(
//           res.data.profilePic
//             ? `http://localhost:5000${res.data.profilePic}`
//             : null
//         );
//       } catch (err) {
//         console.error(err.response?.data || err.message);
//       }
//     };
//     fetchProfile();
//   }, [token]);

//   // Handle image selection + preview
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setProfilePic(file);
//     if (file) {
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   // Handle save (update profile)
//   const handleSave = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("name", name);
//       formData.append("bio", bio);
//       if (profilePic) {
//         formData.append("profilePic", profilePic);
//       }

//       const res = await axios.put("http://localhost:5000/api/profile", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setUser(res.data);
//       alert("Profile updated successfully!");
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//       alert("Failed to update profile");
//     }
//   };

//   return (
//     <div className="profile-page">
//       <h2>My Profile</h2>
//       <div className="profile-section">
//         {preview ? (
//           <img
//             src={preview}
//             alt="Profile Preview"
//             style={{ width: "150px", height: "150px", borderRadius: "50%" }}
//           />
//         ) : (
//           <div
//             style={{
//               width: "150px",
//               height: "150px",
//               borderRadius: "50%",
//               background: "#ccc",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             No Image
//           </div>
//         )}
//         <input type="file" accept="image/*" onChange={handleImageChange} />
//       </div>

//       <div className="profile-info">
//         <label>Name:</label>
//         <input value={name} onChange={(e) => setName(e.target.value)} />

//         <label>Bio:</label>
//         <textarea value={bio} onChange={(e) => setBio(e.target.value)} />

//         <button onClick={handleSave}>Save</button>
//       </div>
//     </div>
//   );
// };

// export default Profile;
