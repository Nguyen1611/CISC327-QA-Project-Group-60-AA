import { useState } from 'react';
import '../styles/BookingPayment.css';
import PaymentSuccessfully from '../pages/PaymentSuccessfully.jsx';
import PaymentFailed from '../pages/PaymentFailed.jsx';

const BookingPayment = () => {

  const defaultFlightDetails = {
    _id: '6726f4075edf20eb09d8f39a',
    fromLocation: 'Toronto',
    toLocation: 'Montreal',
    price: 79,
    img: 'toronto-montreal.jpg',
    tripType: 'One Way',
    date: '2024-12-01',
    availableSeats: [
      { seat: '1A', available: true },
      { seat: '1B', available: false }
    ]
  };

  // Use location state if available, otherwise fallback to default flight details
  const flightDetails =  defaultFlightDetails;

  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

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
      <PaymentSuccessfully
        route={`${flightDetails.fromLocation} → ${flightDetails.toLocation}`}
        departureTime={flightDetails.date}
        arrivalTime={flightDetails.date} // Adjust based on duration if available
        totalPrice={flightDetails.price + 100} // Add any additional fees if applicable
      />
    );
  } else if (error) {
    return (
      <PaymentFailed
        errorMessage={error} // Pass the error message to the PaymentFailed component
      />
    );
  }

  return (
    <div className="booking-payment">
      <h2 className="title">Review & Secure Payment</h2>

      {/* Flight Route Information */}
      <div className="fancy-flight-info">
        <h3>Flight Information</h3>
        <div className="flight-details">
          <div className="flight-header">
            <img src={`/images/${flightDetails.img}`} alt="Flight" className="flight-icon" />
            <p className="flight-route">{`${flightDetails.fromLocation} → ${flightDetails.toLocation}`}</p>
          </div>
          <div className="flight-time">
            <p><strong>Date:</strong> {flightDetails.date}</p>
            <p><strong>Trip Type:</strong> {flightDetails.tripType}</p>
          </div>
          <div className="available-seats">
            <p><strong>Available Seats:</strong></p>
            <ul>
              {flightDetails.availableSeats.map((seat) => (
                <li key={seat.seat} className={seat.available ? 'available' : 'unavailable'}>
                  {seat.seat} {seat.available ? '(Available)' : '(Booked)'}
                </li>
              ))}
            </ul>
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
        <form onSubmit={handlePayment} className="payment-form">
          {/* Card fields go here */}
          <button type="submit" className="payment-btn" data-testid="confirm-payment-btn">Confirm Payment</button>
        </form>
      </div>
    </div>
  );
};

export default BookingPayment;


        
