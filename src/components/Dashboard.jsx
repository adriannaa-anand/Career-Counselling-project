import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 text-center">
      <h2>Welcome to Your Career Dashboard!</h2>
      <p className="mt-3">Let's explore your career and domain preferences.</p>

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

export default Dashboard;
