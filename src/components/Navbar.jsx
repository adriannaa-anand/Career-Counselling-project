import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Career Guide
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/quiz">Quiz</Link>
        {isLoggedIn ? (
          <>
            <div className="dropdown">
              <button className="dropbtn">
                <span role="img" aria-label="roadmap">🎯</span> My Roadmaps
              </button>
              <div className="dropdown-content">
                <Link to="/career-roadmap">Career Roadmap</Link>
                <Link to="/domain-roadmap">Domain Roadmap</Link>
              </div>
            </div>
            <Link to="/feedback">Feedback</Link>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>

      <style jsx>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: #2c3e50;
          color: white;
        }

        .navbar-logo {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .navbar-links {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        .navbar-links a {
          color: white;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          transition: background-color 0.3s;
        }

        .navbar-links a:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .dropdown {
          position: relative;
          display: inline-block;
        }

        .dropbtn {
          background: transparent;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
        }

        .dropdown-content {
          display: none;
          position: absolute;
          background-color: #f9f9f9;
          min-width: 160px;
          box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
          z-index: 1;
          border-radius: 4px;
          overflow: hidden;
        }

        .dropdown-content a {
          color: #2c3e50;
          padding: 12px 16px;
          text-decoration: none;
          display: block;
          transition: background-color 0.3s;
        }

        .dropdown-content a:hover {
          background-color: #f1f1f1;
        }

        .dropdown:hover .dropdown-content {
          display: block;
        }

        .dropdown:hover .dropbtn {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        .logout-btn {
          background: transparent;
          border: 1px solid white;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .logout-btn:hover {
          background: white;
          color: #2c3e50;
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 1rem;
          }

          .navbar-links {
            gap: 1rem;
          }

          .navbar-links a {
            padding: 0.4rem 0.8rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
