import React from 'react';
import '../styles/PaymentSuccessfully.css';

const PaymentSuccessfully = ({ route, departureTime, arrivalTime, totalPrice }) => {
  return (
    <div className="payment-successfully">
      <h3>Payment Successful!</h3>
      <p>Thank you for your purchase!</p>
      <div className="payment-details">
        <p><strong>Route:</strong> {route}</p>
        <p><strong>Departure Time:</strong> {departureTime}</p>
        <p><strong>Arrival Time:</strong> {arrivalTime}</p>
        <p><strong>Total Price:</strong> ${totalPrice}</p>
      </div>
    </div>
  );
};

export default PaymentSuccessfully;
