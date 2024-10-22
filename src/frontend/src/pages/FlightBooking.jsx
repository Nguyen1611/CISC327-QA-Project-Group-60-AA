import { useState } from 'react';
import '../styles/FlightBooking.css'; // Create this file for styling

const FlightBooking = () => {
  const [tripType, setTripType] = useState('Round Trip');
  const flights = [
    { id: 1, route: 'Paris → Toronto', price: 2296, img: 'paris-toronto.jpg' },
    { id: 2, route: 'Toronto → Vancouver', price: 279, img: 'toronto-vancouver.jpg' },
    { id: 3, route: 'Vancouver → Montreal', price: 382, img: 'vancouver-montreal.jpg' },
    { id: 4, route: 'Toronto → Montreal', price: 79, img: 'toronto-montreal.jpg' },
    { id: 5, route: 'Toronto → Vancouver', price: 149, img: 'toronto-vancouver.jpg' },
    { id: 6, route: 'Paris → Hanoi', price: 2296, img: 'paris-hanoi.jpg', large: true },
  ];

  return (
    <div className="flight-booking">
      {/* Top Section */}
      <div className="trip-selection">
        <label>
          <input type="radio" name="tripType" checked={tripType === 'One Way'} onChange={() => setTripType('One Way')} />
          One Way
        </label>
        <label>
          <input type="radio" name="tripType" checked={tripType === 'Round Trip'} onChange={() => setTripType('Round Trip')} />
          Round Trip
        </label>
        <label>
          <input type="radio" name="tripType" checked={tripType === 'Special Round Trip'} onChange={() => setTripType('Special Round Trip')} />
          Special Round Trip
        </label>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-fields">
          <input type="text" placeholder="Flight from?" />
          <input type="text" placeholder="Where to?" />
          <input type="date" placeholder="Depart" />
          <input type="date" placeholder="Return" />
          <select>
            <option>1 Adult, Economy</option>
            <option>2 Adults, Economy</option>
            {/* Add more options as needed */}
          </select>
          <button>Search</button>
        </div>
      </div>

      {/* Flight Cards */}
      <div className="flight-cards">
        {flights.map(flight => (
          <div key={flight.id} className={`flight-card ${flight.large ? 'large' : ''}`}>
            <img src={`images/${flight.img}`} alt={flight.route} />
            <div className="flight-info">
              <h3>{flight.route}</h3>
              <p>${flight.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Section */}
      <div className="footer">
        <button>Back</button>
        <button>Next</button>
        <div className="language-selector">
          <select>
            <option>English</option>
            <option>French</option>
            {/* Add more language options */}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FlightBooking;