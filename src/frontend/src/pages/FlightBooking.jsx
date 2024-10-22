import { useState } from 'react';
import '../styles/FlightBooking.css'; // Create this file for styling

const FlightBooking = () => {
  const [tripType, setTripType] = useState('Round Trip');
  const [searchFrom, setSearchFrom] = useState(''); // State for 'Flight from' search
  const [searchTo, setSearchTo] = useState(''); // State for 'Where to?' search
  const [fromDate, setFromDate] = useState(''); // State for 'From date'
  const [toDate, setToDate] = useState(''); // State for 'To date'

  // Flight data
  const flights = [
    { id: 1, fromLocation: 'Paris', toLocation: 'Toronto', price: 2296, img: 'paris-toronto.jpg', tripType: 'Round Trip', date: '2024-12-01' },
    { id: 2, fromLocation: 'Toronto', toLocation: 'Vancouver', price: 279, img: 'toronto-vancouver.jpg', tripType: 'Round Trip', date: '2024-12-01' },
    { id: 3, fromLocation: 'Vancouver', toLocation: 'Montreal', price: 382, img: 'vancouver-montreal.jpg', tripType: 'Round Trip', date: '2024-12-01' },
    { id: 4, fromLocation: 'Toronto', toLocation: 'Montreal', price: 79, img: 'toronto-montreal.jpg', tripType: 'One Way', date: '2024-12-01' },
    { id: 5, fromLocation: 'Toronto', toLocation: 'Vancouver', price: 149, img: 'toronto-vancouver.jpg', tripType: 'One Way', date: '2024-12-03' },
    { id: 6, fromLocation: 'Paris', toLocation: 'Hanoi', price: 2296, img: 'paris-hanoi.jpg', tripType: 'Special Round Trip', date: '2024-12-01' },
  ];

  // Filter flights based on trip type and search criteria
  const filteredFlights = flights.filter(flight => {
    const regexFrom = new RegExp(searchFrom, 'i'); // Regular expression for 'Flight from'
    const regexTo = new RegExp(searchTo, 'i'); // Regular expression for 'Where to?'

    // Parse dates (parsedFromDate <= flightDate <= parsedToDate)
    const flightDate = new Date(flight.date);
    const parsedFromDate = new Date(fromDate);
    const parsedToDate = new Date(toDate);

    return (
      flight.tripType === tripType &&
      regexFrom.test(flight.fromLocation) &&
      regexTo.test(flight.toLocation) &&
      (fromDate === '' || flightDate >= parsedFromDate) &&
      (toDate === '' || flightDate <= parsedToDate)
    );
  });

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
          <input 
            type="text" 
            placeholder="Flight from?" 
            value={searchFrom} 
            onChange={(e) => setSearchFrom(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Where to?" 
            value={searchTo} 
            onChange={(e) => setSearchTo(e.target.value)} 
          />
          <input 
            name="depart"
            placeholder="Depart"
            type="date" 
            value={fromDate} 
            onChange={(e) => setFromDate(e.target.value)} 
          />
          <input
            name="return"
            placeholder="Return"
            type="date" 
            value={toDate} 
            onChange={(e) => setToDate(e.target.value)} 
          />
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
        {filteredFlights.map((flight) => (
          <div key={flight.id} className="flight-card">
            <img src={`images/${flight.img}`} alt={`${flight.fromLocation} → ${flight.toLocation}`} />
            <div className="flight-info">
              <h3>{flight.fromLocation} → {flight.toLocation}</h3>
              <p>${flight.price}</p>
              <p>{flight.tripType}</p>
              <p>{flight.date}</p>
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
