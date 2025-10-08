import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <div className="homepage-left">
        <h1>Welcome to <br /> <span>Career Guide</span></h1>
        <p className="subtitle">Your personalized career counselling companion</p>
        <div className="buttons">
          <button className="btn btn-primary me-3" onClick={() => navigate("/login")}>Login</button>
          <button className="btn btn-dark" onClick={() => navigate("/register")}>Register</button>
        </div>
      </div>
      <div className="homepage-right">
        <img
          src="https://www.achurchconsulting.com/wp-content/uploads/2022/02/career-high.png"
          alt="Career Guide"
        />
      </div>
    </div>
  );
};

export default HomePage;
