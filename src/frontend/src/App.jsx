import React from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./component/Navbar";
import FlightBooking from "./pages/FlightBooking";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import BookingPayment from "./pages/BookingPayment";
import NotFound from "./pages/NotFound";
import PaymentSuccessfully from "./pages/PaymentSuccessfully"
import PaymentFailed from "./pages/PaymentFailed"
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
          {/* Navbar always visible */}
          <Navbar />
        <Routes>
        <Route path="/" element={<FlightBooking />} />
            <Route path="/booking" element={<BookingPayment />} />
            <Route path="/landing" element={<FlightBooking />} />
            <Route path="/paymentsuccessful" element={<PaymentSuccessfully />} />
            <Route path="/paymentfailed" element={<PaymentFailed />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

