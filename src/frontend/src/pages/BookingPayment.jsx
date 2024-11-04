import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../styles/BookingPayment.css';

const BookingPayment = () => {
  const [searchParams] = useSearchParams();
  const flightId = searchParams.get('id'); // Get the flight ID from the URL
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [flightDetails, setFlightDetails] = useState(null); // State to hold flight details

  // Fetch flight details based on flight ID
  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/get-flight/${flightId}`); // Update this endpoint as needed
        if (!response.ok) {
          throw new Error('Failed to fetch flight details');
        }
        const data = await response.json();
        setFlightDetails(data.flight); // Assuming the response structure includes the flight object
      } catch (error) {
        console.error('Error fetching flight details:', error);
      }
    };

    fetchFlightDetails();
  }, [flightId]);

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
      setSuccess(false);
    } else {
      setError('');
      setSuccess(true);
      setConfirmed(true); // Simulate successful confirmation
    }
  };

  if (confirmed) {
    return (
      <div className="booking-confirmation">
        <h2>Booking Confirmation</h2>
        <p>Your payment was successful!</p>
        {flightDetails && (
          <>
            <p>Flight Route: {flightDetails.route}</p>
            <p>Departure Time: {flightDetails.departureTime}</p>
            <p>Arrival Time: {flightDetails.arrivalTime}</p>
            <p>Total Price: ${flightDetails.price + 100}</p>
          </>
        )}
      </div>
    );
  }

  if (!flightDetails) {
    return <div>Loading flight details...</div>; // Loading state while fetching flight details
  }

  return (
    <div className="booking-payment">
      <h2 className="title">Review & Secure Payment</h2>

      {/* Flight Route Information */}
      <div className="fancy-flight-info">
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
            <label htmlFor="email">Email Address <span className="required">*</span></label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-field">
            <label htmlFor="phone">Phone Number <span className="required">*</span></label>
            <input
              id="phone"
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

        {error && <p className="error-message" role="alert">{error}</p>}
        {success && <p className="success-message">Payment Successful!</p>}

        <form onSubmit={handlePayment} className="payment-form">
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="cardholderName">Cardholder Name <span className="required">*</span></label>
              <input
                id="cardholderName"
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                required
                placeholder="Enter Cardholder Name"
              />
            </div>
            <div className="form-field">
              <label htmlFor="cardNumber">Card Number <span className="required">*</span></label>
              <input
                id="cardNumber"
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
                placeholder="•••• •••• •••• ••••"
              />
            </div>
            <div className="form-field small-field">
              <label htmlFor="expirationDate">Expiration Date <span className="required">*</span></label>
              <input
                id="expirationDate"
                type="text"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="form-field small-field">
              <label htmlFor="cvv">CVV <span className="required">*</span></label>
              <input
                id="cvv"
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="CVV"
                required
              />
            </div>
          </div>
          <button type="submit" className="payment-btn" data-testid="confirm-payment-btn">Confirm Payment</button>
        </form>
      </div>
    </div>
  );
};

export default BookingPayment;
