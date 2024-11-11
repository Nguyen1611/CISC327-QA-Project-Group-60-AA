import React from 'react';
import '../styles/PaymentFailed.css';

const PaymentFailed = ({ errorMessage }) => {
  return (
    <div className="payment-failed">
      <h3>Payment Failed</h3>
      {errorMessage ? (
        <p className="error-message">{errorMessage}</p>
      ) : (
        <p className="error-message">Something went wrong. Please try again later.</p>
      )}
    </div>
  );
};

export default PaymentFailed;
