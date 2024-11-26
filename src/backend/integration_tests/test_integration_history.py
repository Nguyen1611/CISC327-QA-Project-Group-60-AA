import json
import sys
import os
from dotenv import load_dotenv
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
from app import app 
from pymongo import MongoClient
from mongomock import MongoClient as MockMongoClient
import pytest
from unittest.mock import patch

# Integration test for the /getBookingHistory endpoint
@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@patch('app.users_collection.find_one')  # Mocking the 'find_one' method from users_collection
def test_get_booking_history(mock_find_one, client):
    # Mock user data with booking history
    mock_user = {
        "Email": "testuser@example.com",
        "BookingHistory": ["NY-LA-20240101123045", "LA-SF-20240215121500"]
    }

    # Set up the mock to return the user when queried
    mock_find_one.return_value = mock_user

    # Test for valid user
    response = client.get('/getBookingHistory?email=testuser@example.com')
    assert response.status_code == 200
    response_json = json.loads(response.data)
    assert response_json['bookingHistory'] == mock_user['BookingHistory']

    # Test for user not found
    mock_find_one.return_value = None  # Simulate no user found
    response = client.get('/getBookingHistory?email=unknown@example.com')
    assert response.status_code == 404
    response_json = json.loads(response.data)
    assert response_json['message'] == "User not found"

    # Test for user with no booking history
    mock_user_no_history = {
        "Email": "nobookings@example.com",
        "BookingHistory": []
    }
    mock_find_one.return_value = mock_user_no_history
    response = client.get('/getBookingHistory?email=nobookings@example.com')
    assert response.status_code == 200
    response_json = json.loads(response.data)
    assert response_json['bookingHistory'] == []
