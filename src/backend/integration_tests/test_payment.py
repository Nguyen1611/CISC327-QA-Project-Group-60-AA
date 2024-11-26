import json
import sys
import os
from dotenv import load_dotenv
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
from app import app 
from pymongo import MongoClient
from flask import Flask, json
from mongomock import MongoClient
from bson.objectid import ObjectId
import pytest
from unittest.mock import patch

# Integration test for the /confirmBooking endpoint
@patch('app.flights_collection.find_one')  # Mocking the 'find_one' method from flights_collection
@patch('app.is_valid_payment')  # Mocking the 'is_valid_payment' method
def test_confirm_booking(mock_is_valid_payment, mock_find_one):
    client = app.test_client()
    
    # Mock the response of find_one to return a valid flight
    mock_flight = {
        "_id": ObjectId("6475d8b8f1b0c672442b4005"),
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
        "flight_id": str(mock_flight["_id"])  # Convert ObjectId to string
    }

    # Test for successful booking confirmation
    response = client.post('/confirmBooking', json=request_data)
    assert response.status_code == 200
    response_json = json.loads(response.data)

    print(response_json)


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
