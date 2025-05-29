import React from "react";
import "./Home.css";
import bgImage from "./WhatsApp_Image_2025-05-22_at_12.21.38_AM.jpeg";

const features = [
  {
    title: "Skill Exchange Matching",
    description: "Connect with freelancers who need your skills and offer what you seek."
  },
  {
    title: "Real-Time Chat",
    description: "Instantly chat with matched users for collaboration and negotiation."
  },
  {
    title: "Verified Profiles",
    description: "Trustworthy profiles with verified skills and reviews."
  },
  {
    title: "Skill Credit System",
    description: "Earn and use skill credits instead of money."
  },
];

const Home = () => {
  return (
    <div className="home">
      <div
        className="hero"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="overlay">
          <div className="hero-content">
            <h1>SKILL-LINK</h1>
            <p>The Freelancer Skill Exchange Platform</p>
            <div className="hero-buttons">
              <button className="primary-btn">Get Started</button>
              <button className="secondary-btn">Learn More</button>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>Why Choose Skill-Link?</h2>
        <div className="features-grid">
          {features.map((feature, idx) => (
            <div className="feature-card" key={idx}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section about">
            <h3>About Skill-Link</h3>
            <p>Skill-Link is a platform that connects freelancers for skill exchange, collaboration, and growth.</p>
          </div>
          <div className="footer-section links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/profile">Profile</a></li>
              <li><a href="/login">Login</a></li>
            </ul>
          </div>
          <div className="footer-section contact">
            <h3>Contact Us</h3>
            <p>Email: support@skill-link.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Freelancer St, Tech City</p>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Skill-Link. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
