// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./Dashboard.css";

// const Dashboard = () => {
//   const [profile, setProfile] = useState(null);
//   const [credit, setCredit] = useState(null);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const userEmail = localStorage.getItem("userEmail");
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!userEmail) {
//       navigate("/login");
//       return;
//     }

//     const fetchProfile = async () => {
//       try {
//         const { data } = await axios.get(`https://skill-exchange-06xf.onrender.com/api/users/profile/${userEmail}`);
//         setProfile(data);
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//         setError("Failed to load profile. Please try again later.");
//       }
//     };

//     const fetchCredit = async () => {
//       try {
//         const { data } = await axios.get("https://skill-exchange-06xf.onrender.com/api/credits/my", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setCredit(data.totalCredits);
//       } catch (err) {
//         console.error("Error fetching credit:", err);
//       }
//     };

//     fetchProfile();
//     fetchCredit();
//   }, [userEmail, navigate, token]);

//   const handleEdit = () => {
//     navigate("/profile");
//   };

//   return (
//     <div className="dashboard">
//       <h2>Dashboard</h2>
//       {error && <p className="error">{error}</p>}
//       {profile ? (
//         <div className="profile-card">
//           <img src={profile.portfolio || "default-avatar.png"} alt="Profile" className="profile-avatar" />
//           <h3>{profile.name}</h3>
//           <p>Email: {profile.email}</p>
//           <p>Skills: {profile.skills.join(", ")}</p>
//           <p>Experience: {profile.experience} years</p>
//           <p><strong>Total Skill Credits:</strong> {credit ?? "Loading..."}</p>
//           <button onClick={handleEdit} className="edit-button">
//             Edit Profile
//           </button>
//         </div>
//       ) : (
//         <p>Loading profile...</p>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
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
        const { data } = await axios.get(`http://localhost:5000/api/users/profile/${userEmail}`);
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile. Please try again later.");
      }
    };

    const fetchCredit = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/credits/my", {
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
