import React from 'react';
import '../styles/PaymentFailed.css';

const PaymentFailed = () => {
  return (
    <div className="payment-failed">
      <h3>Payment Failed</h3>
      <p>There was an issue processing your payment. Please try again with a valid card.</p>
    </div>
  );
};

export default PaymentFailed;
