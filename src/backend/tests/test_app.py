import json
from dotenv import load_dotenv
import os
from app import app, client, is_valid_payment   # Assuming app is your Flask app
from unittest.mock import patch
from datetime import datetime
import pytest
from pymongo import MongoClient

from flask import json
import mongomock
from bson import ObjectId



# Load environment variables from .env.test for tests
load_dotenv()

@patch('app.users_collection.find_one')
def test_getBookingHistory(mock_find_one):
    client = app.test_client()
    mock_email = "testuser@example.com"

    # Mock the response of find_one to return a user with booking history
    mock_find_one.return_value = {"Email": mock_email, "BookingHistory": ["NY-LA-20240101"]}

    response = client.get(f'/getBookingHistory?email={mock_email}')
    assert response.status_code == 200
    response_json = json.loads(response.data)
    assert 'bookingHistory' in response_json

    # Test for a user not found
    mock_nonexistent_email = "nonexistent@example.com"
    mock_find_one.return_value = None
    response = client.get(f'/getBookingHistory?email={mock_nonexistent_email}')
    assert response.status_code == 404
    response_json = json.loads(response.data)
    assert 'message' in response_json
    assert response_json['message'] == "User not found"




@patch('app.flights_collection.find_one')  # Mocking the 'find_one' method from flights_collection
@patch('app.is_valid_payment')  # Mocking the 'is_valid_payment' method
def test_confirmBooking(mock_is_valid_payment, mock_find_one):
    client = app.test_client()
    
    # Mock the response of find_one to return a valid flight
    mock_flight = {
        "_id": "6475d8b8f1b0c672442b4005",
        "fromLocation": "New York",
        "toLocation": "Los Angeles",
        "price": 300,
        "date": "2024-12-15",
        "Available Seats": [{"seatNumber": "1A", "available": True}]
    }
    mock_find_one.return_value = mock_flight
    
    # Mock the payment validation to return True (valid payment) initially
    mock_is_valid_payment.return_value = True

    # Data for the POST request
    request_data = {
        "user_email": "testuser@example.com",
        "flight_data": {"fromLocation": "New York", "toLocation": "Los Angeles", "date": "2024-12-15"},
        "payment_details": {"cardNumber": "1234567812345678", "cvv": "123", "expirationDate": "12/24"},
        "flight_id": "6475d8b8f1b0c672442b4005"
    }
    
    # Test for successful booking confirmation
    response = client.post('/confirmBooking', json=request_data)
    assert response.status_code == 200
    response_json = json.loads(response.data)
    assert response_json['message'] == "Booking confirmed successfully!"
    assert 'flight' in response_json
    assert response_json['flight']['fromLocation'] == mock_flight['fromLocation']
    assert response_json['flight']['toLocation'] == mock_flight['toLocation']
    
    # Test for invalid payment details
    mock_is_valid_payment.return_value = False  # Simulating invalid payment
    response = client.post('/confirmBooking', json=request_data)
    assert response.status_code == 400
    response_json = json.loads(response.data)
    assert 'message' in response_json
    assert response_json['message'] == "Invalid payment."

    # Test for missing required information
    request_data_missing = {key: value for key, value in request_data.items() if key != 'payment_details'}
    response = client.post('/confirmBooking', json=request_data_missing)
    assert response.status_code == 400
    response_json = json.loads(response.data)
    assert response_json['message'] == "Missing required information."
    
    # Test for flight not found
    mock_find_one.return_value = None  # Simulating no flight found
    response = client.post('/confirmBooking', json=request_data)
    assert response.status_code == 404
    response_json = json.loads(response.data)
    assert response_json['message'] == "Flight not found."

    # Test for no available seats
    mock_flight["Available Seats"] = [{"seatNumber": "1A", "available": False}]
    mock_find_one.return_value = mock_flight
    response = client.post('/confirmBooking', json=request_data)
    assert response.status_code == 400
    response_json = json.loads(response.data)
    assert response_json['message'] == "No available seats on this flight."




# Mock MongoDB client
@pytest.fixture
def mongo_client(monkeypatch):
    # Create a mock MongoDB client using mongomock
    mock_client = mongomock.MongoClient()
    monkeypatch.setattr("app.client", mock_client)
    return mock_client

@pytest.fixture
def client(mongo_client):
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

# Sample flight data
sample_flights = [
    {
        '_id': ObjectId('6726f2c45edf20eb09d8f397'),
        'fromLocation': 'Paris',
        'toLocation': 'Toronto',
        'price': 2296,
        'img': 'paris-toronto.jpg',
        'tripType': 'Round Trip',
        'date': '2024-12-01',
        'Available Seats': [
            {'seat': '1A', 'available': True},
            {'seat': '1B', 'available': False}
        ]
    },
    # Additional sample flights...
]

# Insert sample data into mock database before running each test
@pytest.fixture
def populate_db(mongo_client):
    db = mongo_client['FlightDatabase']
    collection = db['flights']
    collection.insert_many(sample_flights)

# Test for /get-flights endpoint
def test_get_flights(client, populate_db):
    response = client.get('/get-flights')
    data = json.loads(response.data)

    assert response.status_code == 200
    assert "flights" in data
    assert len(data["flights"]) <= 10  # Should return up to 10 flights

# Test for /get-flight/<flight_id> endpoint with valid ID
def test_get_flight_valid_id(client, populate_db):
    valid_id = "6726f2c45edf20eb09d8f397"  # One of the ObjectIds in the sample data
    response = client.get(f'/get-flight/{valid_id}')
    data = json.loads(response.data)

    assert response.status_code == 200
    assert "flight" in data
    assert data["flight"]["_id"] == valid_id

# Test for /get-flight/<flight_id> endpoint with invalid ID
def test_get_flight_invalid_id(client):
    invalid_id = "invalid_flight_id"
    response = client.get(f'/get-flight/{invalid_id}')
    data = json.loads(response.data)

    assert response.status_code == 400
    assert data['error'] == 'Invalid flight ID format.'


@pytest.fixture
def client():
    # Setup a test client for the Flask app
    with app.test_client() as client:
        yield client

def test_before_request(client):
    # Simulate an OPTIONS request
    response = client.options('/some-endpoint')  # Replace with the actual endpoint you want to test

    # Check that the response status code is 200
    assert response.status_code == 200

    # Check the response body for the correct message
    response_json = json.loads(response.data)
    assert 'message' in response_json
    assert response_json['message'] == 'OK'

    # Check for correct CORS headers
    assert response.headers['Access-Control-Allow-Origin'] == 'http://localhost:5173'
    assert response.headers['Access-Control-Allow-Methods'] == 'POST, GET, OPTIONS'
    assert response.headers['Access-Control-Allow-Headers'] == 'Content-Type, Authorization'





def test_is_valid_payment():
    # Test for valid payment details
    valid_payment = {
        "cardNumber": "1234567812345678",
        "expirationDate": "12/24",
        "cvv": "123"
    }
    assert is_valid_payment(valid_payment) == True

    # Test for invalid card number length (less than 16 digits)
    invalid_card_number = {
        "cardNumber": "123456781234567",
        "expirationDate": "12/24",
        "cvv": "123"
    }
    assert is_valid_payment(invalid_card_number) == False

    # Test for invalid CVV length (not 3 digits)
    invalid_cvv = {
        "cardNumber": "1234567812345678",
        "expirationDate": "12/24",
        "cvv": "12"  # Only 2 digits instead of 3
    }
    assert is_valid_payment(invalid_cvv) == False

    # Test for missing card number
    missing_card_number = {
        "expirationDate": "12/24",
        "cvv": "123"
    }
    assert is_valid_payment(missing_card_number) == False

    # Test for missing CVV
    missing_cvv = {
        "cardNumber": "1234567812345678",
        "expirationDate": "12/24"
    }
    assert is_valid_payment(missing_cvv) == False


# Test to check if the `users_collection` exists
def test_users_collection(client):
    client_uri = os.getenv('DATABASE_URI')
    # Initialize MongoDB client
    client = MongoClient(client_uri)
    db = client.user_database
    users_collection = db.users
    
    # Check if the users collection exists
    assert users_collection is not None
    assert users_collection.name == "users"

    print("users_collection exists in the database.")