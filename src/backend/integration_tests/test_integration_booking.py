import unittest
from app import app  # Import the Flask app
from pymongo import MongoClient
import json
from bson import ObjectId
from datetime import datetime

class FlightBookingIntegrationTests(unittest.TestCase):
    def setUp(self):
        """Set up the Flask test client and test data."""
        self.app = app.test_client()
        self.app.testing = True
        self.headers = {"Content-Type": "application/json"}

        # Set up database connection
        self.client = MongoClient("mongodb://localhost:27017/")  # Update with your DB URI
        self.db = self.client['FlightDatabase']
        self.flights_collection = self.db['flights']
        self.users_collection = self.db['users']

        # Add a test flight
        self.test_flight = {
            "fromLocation": "New York",
            "toLocation": "London",
            "price": 800,
            "date": datetime.now().isoformat(),
            "Available Seats": [{"seat_number": 1, "available": True}]
        }
        self.test_flight_id = self.flights_collection.insert_one(self.test_flight).inserted_id

        # Add a test user
        self.test_user = {
            "Email": "testuser@example.com",
            "BookingHistory": []
        }
        self.users_collection.insert_one(self.test_user)

    def tearDown(self):
        """Clean up test data after each test."""
        self.flights_collection.delete_one({"_id": self.test_flight_id})
        self.users_collection.delete_one({"Email": self.test_user["Email"]})
        self.client.close()

    def test_get_flights(self):
        """Test retrieving all available flights."""
        response = self.app.get("/get-flights", headers=self.headers)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.get_data(as_text=True))
        self.assertIn("flights", data)
        self.assertGreater(len(data["flights"]), 0)

    # def test_confirm_booking_success(self):
    #     """Test successfully confirming a booking."""
    #     payload = {
    #         "user_email": self.test_user["Email"],
    #         "flight_data": {
    #             "fromLocation": self.test_flight["fromLocation"],
    #             "toLocation": self.test_flight["toLocation"],
    #             "price": self.test_flight["price"],
    #             "date": self.test_flight["date"]
    #         },
    #         "payment_details": {"method": "credit_card", "amount": 800},
    #         "flight_id": str(self.test_flight_id)
    #     }

    #     response = self.app.post("/confirmBooking", data=json.dumps(payload), headers=self.headers)
    #     self.assertEqual(response.status_code, 200)
    #     data = json.loads(response.get_data(as_text=True))
    #     self.assertIn("message", data)
    #     self.assertEqual(data["message"], "Booking confirmed successfully!")
    #     self.assertIn("flight_code", data)

    #     # Check if the seat was reserved and booking was added to user history
    #     updated_flight = self.flights_collection.find_one({"_id": self.test_flight_id})
    #     updated_user = self.users_collection.find_one({"Email": self.test_user["Email"]})
    #     self.assertFalse(updated_flight["Available Seats"][0]["available"])
    #     self.assertIn(data["flight_code"], updated_user["BookingHistory"])

    # def test_confirm_booking_no_seats(self):
    #     """Test booking when no seats are available."""
    #     # Update the flight to have no available seats
    #     self.flights_collection.update_one(
    #         {"_id": self.test_flight_id},
    #         {"$set": {"Available Seats": [{"seat_number": 1, "available": False}]}}
    #     )

    #     payload = {
    #         "user_email": self.test_user["Email"],
    #         "flight_data": {
    #             "fromLocation": self.test_flight["fromLocation"],
    #             "toLocation": self.test_flight["toLocation"],
    #             "price": self.test_flight["price"],
    #             "date": self.test_flight["date"]
    #         },
    #         "payment_details": {"method": "credit_card", "amount": 800},
    #         "flight_id": str(self.test_flight_id)
    #     }

    #     response = self.app.post("/confirmBooking", data=json.dumps(payload), headers=self.headers)
    #     self.assertEqual(response.status_code, 400)
    #     data = json.loads(response.get_data(as_text=True))
    #     self.assertIn("message", data)
    #     self.assertEqual(data["message"], "No available seats on this flight.")

    def test_confirm_booking_invalid_flight(self):
        """Test booking with an invalid flight ID."""
        payload = {
            "user_email": self.test_user["Email"],
            "flight_data": {
                "fromLocation": "Invalid",
                "toLocation": "Invalid",
                "price": 1000,
                "date": "2023-12-31"
            },
            "payment_details": {"method": "credit_card", "amount": 1000},
            "flight_id": str(ObjectId())
        }

        response = self.app.post("/confirmBooking", data=json.dumps(payload), headers=self.headers)
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.get_data(as_text=True))
        self.assertIn("message", data)
        self.assertEqual(data["message"], "Flight not found.")

if __name__ == "__main__":
    unittest.main()
