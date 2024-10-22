import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar-header">
      <div className="navbar-content">
        {/* Navigation Links */}
        <ul className="navbar-links">
          <li>
            <NavLink to="/flights" className={({ isActive }) => (isActive ? "active" : "")}>
              Flights
            </NavLink>
          </li>
          <li>
            <NavLink to="/my-booking" className={({ isActive }) => (isActive ? "active" : "")}>
              My Booking
            </NavLink>
          </li>
        </ul>

        {/* Sign In and Register buttons */}
        <div className="auth-buttons">
          <button className="btn-signin">
            <NavLink to="/signin" className={({ isActive }) => (isActive ? "active" : "")}>
                Sign In
            </NavLink>
          </button>
          <button className="btn-register">
            <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : "")}>
              Register
            </NavLink>
          </button>
        </div>
      </div>
    </header>
  );
}
