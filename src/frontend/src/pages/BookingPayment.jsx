import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../styles/FlightBooking.css';

const FlightBooking = () => {
  const [tripType, setTripType] = useState('Round Trip');
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [flights, setFlights] = useState([]); // State to hold flight data
  const navigate = useNavigate(); // Initialize the navigate function

  // Fetch flight data from API on component mount
  useEffect(() => {
    fetch('http://127.0.0.1:5000/get-flights')
      .then(response => response.json())
      .then(data => setFlights(data['flights']))
      .catch(error => console.error('Error fetching flights:', error));
  }, []);

  // Filter flights based on trip type and search criteria
  const filteredFlights = flights.filter(flight => {
    const regexFrom = new RegExp(searchFrom, 'i');
    const regexTo = new RegExp(searchTo, 'i');
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

  const handleBookClick = (flightId) => {
    navigate(`/booking?id=${flightId}`);
  };

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
          </select>
          <button>Search</button>
        </div>
      </div>

      {/* Flight Cards */}
      <div className="flight-cards">
        {filteredFlights.map((flight) => (
          <div key={flight._id} className="flight-card"> {/* Use _id instead of id */}
            <img src={`images/${flight.img}`} alt={`${flight.fromLocation} → ${flight.toLocation}`} />
            <div className="flight-info">
              <h3>{flight.fromLocation} → {flight.toLocation}</h3>
              <p>${flight.price}</p>
              <p>{flight.tripType}</p>
              <p>{flight.date}</p>
              <button onClick={() => handleBookClick(flight._id)}>Book</button> {/* Book button */}
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
          </select>
        </div>
      </div>
    </div>
  );
};

export default FlightBooking;
