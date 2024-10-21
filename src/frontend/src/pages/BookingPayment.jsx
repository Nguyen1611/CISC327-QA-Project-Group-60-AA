import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BookingPayment.css';

const BookingPayment = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Mock flight details (for now)
  const flightDetails = {
    route: 'Toronto → Vancouver',
    departureTime: '2024-10-25 14:00',
    arrivalTime: '2024-10-25 16:00',
    price: 279,
  };

  const validatePaymentInfo = () => {
    if (cardNumber.length !== 16 || isNaN(cardNumber)) {
      return 'Invalid card number. It should be 16 digits.';
    }
    if (!/^\d{2}\/\d{2}$/.test(expirationDate)) {
      return 'Expiration date must be in MM/YY format.';
    }
    if (cvv.length !== 3 || isNaN(cvv)) {
      return 'Invalid CVV. It should be 3 digits.';
    }
    if (cardholderName.trim() === '') {
      return 'Cardholder name is required.';
    }
    if (email.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address.';
    }
    if (phone.trim() === '' || isNaN(phone)) {
      return 'Please enter a valid phone number.';
    }
    return ''; // No errors
  };

  const handlePayment = (e) => {
    e.preventDefault();
    const errorMsg = validatePaymentInfo();
    if (errorMsg) {
      setError(errorMsg);
    } else {
      setError('');
      navigate('/payment-success');
    }
  };

  return (
    <div className="booking-payment">
      <h2 className="title">Review & Secure Payment</h2>

      {/* Flight Route Information */}
<div className="flight-info-frame-info">
  <h3>Flight Information</h3>
  <div className="flight-details">
    <div className="flight-header">
      <img src="/icons/plane-icon.png" alt="" className="flight-icon" />
      <p className="flight-route">{flightDetails.route}</p>
    </div>
    <div className="flight-time">
      <p><strong>Departure:</strong> {flightDetails.departureTime}</p>
      <p><strong>Arrival:</strong> {flightDetails.arrivalTime}</p>
    </div>
    <div className="flight-status">
      <p><span className="status-badge">Confirmed</span></p>
    </div>
  </div>
</div>


      {/* Contact Information */}
      <div className="contact-info">
        <h3>Contact Information</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Email Address <span className="required">*</span></label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your-email@example.com"
            />
          </div>
          <div className="form-field">
            <label>Phone Number <span className="required">*</span></label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="123-456-7890"
            />
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="price-summary">
        <h3>Price Summary</h3>
        <div className="summary-line">
          <span>Flight Price</span>
          <span>${flightDetails.price}</span>
        </div>
        <div className="summary-line">
          <span>Taxes & Fees</span>
          <span>$100</span>
        </div>
        <div className="summary-line total">
          <span>Total</span>
          <span>${flightDetails.price + 100}</span>
        </div>
      </div>

      {/* Payment Section */}
      <div className="payment-section">
        <h3>Payment Information</h3>
        <div className="credit-card-display">
          <div className="credit-card">
            <div className="card-number">
              {cardNumber ? cardNumber.replace(/(.{4})/g, '$1 ') : '•••• •••• •••• ••••'}
            </div>
            <div className="card-info">
              <div className="card-name">{cardholderName || 'Cardholder Name'}</div>
              <div className="card-expiry">{expirationDate || 'MM/YY'}</div>
            </div>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handlePayment} className="payment-form">
          <div className="form-grid">
            <div className="form-field">
              <label>Cardholder Name <span className="required">*</span></label>
              <input
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                required
                placeholder="Gia Nguyen dep trai vai l"
              />
            </div>
            <div className="form-field">
              <label>Card Number <span className="required">*</span></label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
                placeholder="•••• •••• •••• ••••"
              />
            </div>
            <div className="form-field small-field">
              <label>Expiration Date <span className="required">*</span></label>
              <input
                type="text"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="form-field small-field">
              <label>CVV <span className="required">*</span></label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="•••"
                required
              />
            </div>
          </div>
          <button type="submit" className="payment-btn">Confirm Payment</button>
        </form>
      </div>
    </div>
  );
};

export default BookingPayment;
