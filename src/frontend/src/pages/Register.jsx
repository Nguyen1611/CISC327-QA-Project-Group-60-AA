import React, { useState } from "react";
import "../styles/Auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password 
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setMessage("Registration successful!");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Sign Up</h2>
        <input 
          type="text" 
          name="firstName" 
          placeholder="First Name" 
          value={formData.firstName} 
          onChange={handleChange} 
        />
        <input 
          type="text" 
          name="lastName" 
          placeholder="Last Name" 
          value={formData.lastName} 
          onChange={handleChange} 
        />
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
