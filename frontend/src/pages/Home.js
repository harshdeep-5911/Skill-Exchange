import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="overlay"></div>
      <div className="content">
        
        <h1>SKILL-LINK </h1>
        <h1>The Freelancer Skill Exchange</h1>
        <p>
          Trade your skills, collaborate, and grow your expertise in a dynamic
          marketplace.
        </p>
        <div className="buttons">
          <button className="primary-btn">Get Started</button>
          <button className="secondary-btn">Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
