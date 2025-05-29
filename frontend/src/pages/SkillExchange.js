import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import io from "socket.io-client";
import "./SkillExchange.css";

const socket = io("https://skill-exchange-06xf.onrender.com");

const SkillExchange = () => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [userNeeds, setUserNeeds] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 6;

  const allSkills = [
    "Web Development",
    "Graphic Design",
    "Data Science",
    "Content Writing",
    "Marketing",
  ];

  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("userEmail");
      setUserEmail(email);

      const { data } = await axios.get("https://skill-exchange-06xf.onrender.com/api/users/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const others = data.filter((profile) => profile.email !== email);
      setProfiles(others);
      setFilteredProfiles(others);

      const user = data.find((u) => u.email === email);
      if (user?.skillsNeeded) setUserNeeds(user.skillsNeeded);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  useEffect(() => {
    fetchProfiles();

    socket.on("refreshMatches", fetchProfiles);
    socket.on("newServiceRequest", ({ toEmail }) => {
      if (toEmail === userEmail) {
        alert("📥 New service request received!");
      }
    });

    return () => {
      socket.off("refreshMatches");
      socket.off("newServiceRequest");
    };
  }, [userEmail]);

  const handleSkillFilter = (skill) => {
    setSelectedSkill(skill);
    applyFilters(skill, search);
  };

  const applyFilters = (skill, query) => {
    let filtered = profiles;

    if (skill) {
      filtered = filtered.filter((user) => user.skills.includes(skill));
    }

    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerQuery) ||
          user.skills.some((s) => s.toLowerCase().includes(lowerQuery))
      );
    }

    setFilteredProfiles(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    applyFilters(selectedSkill, value);
  };

  const indexOfLast = currentPage * profilesPerPage;
  const indexOfFirst = indexOfLast - profilesPerPage;
  const currentProfiles = filteredProfiles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);

  return (
    <div className="skill-exchange">
      <h2>🎯 Skill Exchange</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by name or skill..."
          value={search}
          onChange={handleSearch}
          style={{
            padding: "0.5rem",
            width: "250px",
            marginRight: "1rem",
            borderRadius: "5px",
          }}
        />

        <select
          value={selectedSkill}
          onChange={(e) => handleSkillFilter(e.target.value)}
        >
          <option value="">-- All Skills --</option>
          {allSkills.map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </select>
      </div>

      {currentProfiles.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="user-grid">
          <AnimatePresence>
            {currentProfiles.map((user) => {
              const isMatch = user.skills.some((skill) =>
                userNeeds.includes(skill)
              );
              return (
                <motion.div
                  key={user._id}
                  className="user-card"
                  style={{
                    border: isMatch ? "2px solid green" : undefined,
                    backgroundColor: isMatch ? "#eaffea" : undefined,
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={
                      user.portfolio ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt={user.name}
                    className="profile-img"
                  />

                  <h3>{user.name}</h3>
                  <p><strong>Skills:</strong> {user.skills.join(", ")}</p>
                  <p><strong>Experience:</strong> {user.experience} yrs</p>
                  <button
                    className="connect-btn"
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      if (!token) {
                        alert("You must be logged in to send a request.");
                        return;
                      }

                      try {
                        console.log("Sending request with token:", token); // debug

                        await axios.post(
                          "https://skill-exchange-06xf.onrender.com/api/service-requests/send",
                          {
                            toEmail: user.email,
                            serviceDetails: `Interested in ${user.skills.join(", ")}`,
                          },
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );
                        alert("✅ Service request sent!");
                      } catch (err) {
                        console.error("Send Request Error:", err.response?.data || err.message);
                        alert(
                          err.response?.data?.message ||
                            "❌ Failed to send request."
                        );
                      }
                    }}
                  >
                    Connect
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ marginTop: "1rem" }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            style={{ marginRight: "0.5rem" }}
          >
            Prev
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            style={{ marginLeft: "0.5rem" }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SkillExchange;
