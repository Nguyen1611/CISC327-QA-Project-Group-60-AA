import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar/Navbar";
import FlightBooking from "./pages/FlightBooking";
// import MyBooking from "./pages/Booking";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import "./App.css";

function App() {
  return (
    <Router>
      <div style={{height: '100%'}}>
        {/* Navbar always visible */}
        <Navbar />

        <Routes>
          <Route path="/" element={<FlightBooking />} />
          {/* <Route path="/booking" element={<booking />} /> */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
