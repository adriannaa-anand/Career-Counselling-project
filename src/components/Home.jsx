import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h2>Welcome to Career Guide</h2>
      <p className="mt-3">Choose an option to explore your career path:</p>
      <div className="d-flex justify-content-center gap-3 mt-5">
        <button className="btn btn-primary" onClick={() => navigate("/career")}>
          Take Career Quiz
        </button>
        <button className="btn btn-success" onClick={() => navigate("/domain")}>
          Take Domain Quiz
        </button>
      </div>
    </div>
  );
};

export default Home;