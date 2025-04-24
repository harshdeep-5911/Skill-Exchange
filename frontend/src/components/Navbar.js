import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img
          src="https://www.skilllink.net.au/wp-content/uploads/2017/02/Skill-link-2x.png"
          alt="Skill Exchange Logo"
        />
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        {token ? (
          <>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/services">Services</Link>
            </li>
            <li>
              <Link to="/exchange">Skill Exchange</Link>
            </li>
            <li>
              <Link to="/chat">Chat</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
