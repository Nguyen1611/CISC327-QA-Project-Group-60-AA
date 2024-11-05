import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Auth.css";

// Register component for user registration
const Register = () => {

  // State for form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // State for message display
  const [message, setMessage] = useState('');
  const { login } = useContext(AuthContext);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle user registration
  const handleRegister = async () => {
    
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    if (!isValidEmail(formData.email)) {
      setMessage("Invalid email format.");
      return;
    }
    try {
      // Make POST request to register user
      const response = await fetch("http://127.0.0.1:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();

      // Handle registration response
      if (data.status === "success") {
        login({ email: formData.email });
        setMessage("Registration successful!");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Error connecting to server.");
    }
  };

  // Render registration form
  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Register</h2>
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={handleChange} 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange} 
        />
        <input 
          type="password" 
          name="confirmPassword" 
          placeholder="Confirm Password" 
          value={formData.confirmPassword} 
          onChange={handleChange} 
        />
        <button className="btn-submit" onClick={handleRegister}>Sign Up</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Register;
