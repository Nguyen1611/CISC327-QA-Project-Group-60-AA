import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Auth.css";

// SignIn component for user login
const SignIn = () => {

  // State for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle user login
  const handleSignIn = async () => {
    try {
      // Make POST request to login user
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Handle login response
      if (data.status === "success") {
        login({ email });
        setMessage("Login successful!");
        navigate("/");
      } else {
        setMessage("Invalid credentials.");
      }
    } catch (error) {
      setMessage("Error connecting to server.");
    }
  };

  // Render login form
  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Sign In</h2>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button className="btn-submit" onClick={handleSignIn}>Sign In</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default SignIn;
