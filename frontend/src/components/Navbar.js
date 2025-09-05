// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./Navbar.css";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userEmail");
//     navigate("/login");
//   };

//   return (
//     <nav className="navbar">
//       <div className="logo">
//         <img
//           src="https://www.skilllink.net.au/wp-content/uploads/2017/02/Skill-link-2x.png"
//           alt="Skill Exchange Logo"
//         />
//       </div>
//       <ul className="nav-links">
//         <li>
//           <Link to="/">Home</Link>
//         </li>
//         {token ? (
//           <>
//             <li>
//               <Link to="/profile">Profile</Link>
//             </li>
//             <li>
//               <Link to="/services">Services</Link>
//             </li>
//             <li>
//               <Link to="/exchange">Skill Exchange</Link>
//             </li>
//             <li>
//               <Link to="/chat">Chat</Link>
//             </li>
//             <li>
//               <Link to="/dashboard">Dashboard</Link>
//             </li>
//             <li>
//               <button onClick={handleLogout} className="logout-btn">
//                 Logout
//               </button>
//             </li>
//           </>
//         ) : (
//           <>
//             <li>
//               <Link to="/signup">Signup</Link>
//             </li>
//             <li>
//               <Link to="/login">Login</Link>
//             </li>
//           </>
//         )}
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setMenuOpen(false); // Close menu on logout
    navigate("/login");
  };

  // Function to close the menu when a link is clicked
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          <img
            src="https://www.skilllink.net.au/wp-content/uploads/2017/02/Skill-link-2x.png"
            alt="Skill-Link Logo"
          />
        </NavLink>

        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </div>

        <ul className={menuOpen ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <NavLink to="/" className="nav-link" onClick={closeMenu}>
              Home
            </NavLink>
          </li>
          {token && (
            <>
              <li className="nav-item">
                <NavLink to="/profile" className="nav-link" onClick={closeMenu}>
                  Profile
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/services" className="nav-link" onClick={closeMenu}>
                  Services
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/exchange" className="nav-link" onClick={closeMenu}>
                  Skill Exchange
                </NavLink>
              </li>
               <li className="nav-item">
                <NavLink to="/chat" className="nav-link" onClick={closeMenu}>
                  Chat
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/dashboard" className="nav-link" onClick={closeMenu}>
                  Dashboard
                </NavLink>
              </li>
            </>
          )}
        </ul>

        <div className="nav-auth">
          {token ? (
            <button onClick={handleLogout} className="btn btn-secondary-nav">
              Logout
            </button>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-secondary-nav" onClick={closeMenu}>
                Login
              </NavLink>
              <NavLink to="/signup" className="btn btn-primary-nav" onClick={closeMenu}>
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
