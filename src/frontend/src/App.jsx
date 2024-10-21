import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FlightBooking from './pages/FlightBooking';
import NotFound from './pages/NotFound';
import BookingPayment from './pages/BookingPayment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<FlightBooking />} />
        <Route path="/booking" element={<BookingPayment />} />
        <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
      </Routes>
    </Router>
  );
}

export default App;