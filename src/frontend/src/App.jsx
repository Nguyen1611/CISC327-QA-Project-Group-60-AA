import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./component/Navbar";
import FlightBooking from "./pages/FlightBooking";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import BookingPayment from "./pages/BookingPayment";
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ height: '100%' }}>
          {/* Navbar always visible */}
          <Navbar />

          <Routes>
            <Route path="/" element={<FlightBooking />} />
            <Route path="/booking" element={<BookingPayment />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
