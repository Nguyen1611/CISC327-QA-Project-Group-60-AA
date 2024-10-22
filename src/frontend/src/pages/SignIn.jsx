import React, { useState } from "react";
import "../styles/Auth.css";

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();

      if (data.status === "success") {
        setMessage("Login successful!");
      } else {
        setMessage("Invalid credentials.");
      }
    } catch (error) {
      setMessage("Error connecting to server.");
    }
  };

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
