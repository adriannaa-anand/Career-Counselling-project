import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (response.ok && data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setIsLoggedIn(true);
        navigate("/Home");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: "400px",
      margin: "40px auto",
      padding: "20px",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
      
      {error && (
        <div style={{
          color: "red",
          backgroundColor: "#ffebee",
          padding: "10px",
          borderRadius: "4px",
          marginBottom: "20px",
          textAlign: "center"
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Email"
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px"
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Password"
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px"
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: loading ? "#cccccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px"
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div style={{
        marginTop: "20px",
        textAlign: "center"
      }}>
        Don't have an account? {" "}
        <a
          href="/register"
          style={{
            color: "#4CAF50",
            textDecoration: "none"
          }}
        >
          Register
        </a>
      </div>
    </div>
  );
};

export default Login;
