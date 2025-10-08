import React from "react";
import { useNavigate } from "react-router-dom";

const QuizHome = () => {
  const navigate = useNavigate();

  return (
    <div className="centered-container">
      <h2>Welcome to Career Guide</h2>
      <p>Choose an option to explore your career path:</p>
      <button
        className="btn btn-primary"
        style={{ marginRight: "1rem", minWidth: "180px", fontSize: "1.1rem" }}
        onClick={() => navigate("/career")}
      >
        Take Career Quiz
      </button>
      <button
        className="btn btn-success"
        style={{ minWidth: "180px", fontSize: "1.1rem" }}
        onClick={() => navigate("/domain")}
      >
        Take Domain Quiz
      </button>
      <style jsx>{`
        .centered-container {
          margin: 5rem auto;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.07);
          max-width: 600px;
          padding: 3rem 2rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default QuizHome;