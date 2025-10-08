import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CareerCounsellingQuiz from "./components/CareerCounsellingQuiz";
import DomainPreferenceQuiz from "./components/DomainPreferenceQuiz";
import CareerRoadmap from "./components/CareerRoadmap";
import DomainRoadmap from "./components/DomainRoadmap";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home";
import Feedback from "./components/FeedbackForm";
import HomePage from "./components/HomePage";
import QuizHome from "./components/QuizHome";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="page-container">
      <Router>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
  <Route path="/register" element={<Register />} />

  <Route
    path="/home"
    element={
      <ProtectedRoute isLoggedIn={isLoggedIn}>
        <Home />
      </ProtectedRoute>
    }
  />
  <Route
    path="/career"
    element={
      <ProtectedRoute isLoggedIn={isLoggedIn}>
        <CareerCounsellingQuiz />
      </ProtectedRoute>
    }
  />
  <Route
    path="/domain"
    element={
      <ProtectedRoute isLoggedIn={isLoggedIn}>
        <DomainPreferenceQuiz />
      </ProtectedRoute>
    }
  />
  <Route
    path="/career-roadmap"
    element={
      <ProtectedRoute isLoggedIn={isLoggedIn}>
        <CareerRoadmap />
      </ProtectedRoute>
    }
  />
  <Route
    path="/domain-roadmap"
    element={
      <ProtectedRoute isLoggedIn={isLoggedIn}>
        <DomainRoadmap />
      </ProtectedRoute>
    }
  />
  <Route
    path="/feedback"
    element={
      <ProtectedRoute isLoggedIn={isLoggedIn}>
        <Feedback />
      </ProtectedRoute>
    }
  />
  <Route path="/quiz" element={<QuizHome />} />
</Routes>
      </Router>
    </div>
  );
}

export default App;
