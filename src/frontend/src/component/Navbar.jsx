import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

// Navbar
export default function Navbar() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  return (
    <header className="navbar-header">
      <div className="navbar-content">
        {/* Navigation Links */}
        <ul className="navbar-links">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
              Flights
            </NavLink>
          </li>
        </ul>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          {isAuthenticated ? (
            <>
              <span className="welcome-message">Welcome, {user?.email}!</span>
              <button className="btn-logout" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/signin" className="btn-signin">Sign In</NavLink>
              <NavLink to="/register" className="btn-register">Register</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
