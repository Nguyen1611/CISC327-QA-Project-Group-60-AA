import unittest
from app import app  # Import the Flask app
import json

class AuthIntegrationTests(unittest.TestCase):

    def setUp(self):
        # Set up the Flask test client
        self.app = app.test_client()
        self.app.testing = True
        self.headers = {"Content-Type": "application/json"}

        # Test data for register and login
        self.test_user = {
            "email": "testuser@example.com",
            "password": "TestPassword123"
        }


    def tearDown(self):
        # Clean up: remove the test user from the database if needed
        from pymongo import MongoClient
        from dotenv import load_dotenv
        import os

        # Load environment variables
        load_dotenv("../.env")
        client = MongoClient(os.getenv("DATABASE_URI"))
        db = client['user_database']
        users_collection = db['users']

        # Delete the test user
        users_collection.delete_one({"Email": self.test_user["email"]})

        # close database connection
        client.close()


    # Test valid registration
    def test_register_user(self):
        # Send a POST request to the /auth/register endpoint
        response = self.app.post(
            "/auth/register",
            data=json.dumps(self.test_user),
            headers=self.headers
        )

        self.assertEqual(response.status_code, 201)
        self.assertIn("User registered successfully", response.get_data(as_text=True))


    # Test duplicate registration
    def test_register_duplicate_user(self):
        # Register the user once
        self.app.post("/auth/register", data=json.dumps(self.test_user), headers=self.headers)

        # Try registering the same user again
        response = self.app.post(
            "/auth/register",
            data=json.dumps(self.test_user),
            headers=self.headers
        )

        self.assertEqual(response.status_code, 409)
        self.assertIn("User already exists", response.get_data(as_text=True))

    # Succesful login
    def test_login_user(self):
        # First, register the user
        self.app.post("/auth/register", data=json.dumps(self.test_user), headers=self.headers)

        # Attempt to log in
        response = self.app.post(
            "/auth/login",
            data=json.dumps(self.test_user),
            headers=self.headers
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("Login successful", response.get_data(as_text=True))

    # Test login with incorrect password
    def test_login_incorrect_password(self):
        self.app.post("/auth/register", data=json.dumps(self.test_user), headers=self.headers)
        response = self.app.post(
            "/auth/login",
            data=json.dumps({"email": self.test_user["email"], "password": "WrongPassword123"}),
            headers=self.headers
        )
        self.assertEqual(response.status_code, 401)
        self.assertIn("Invalid credentials", response.get_data(as_text=True))

    # Test login with unregistered email
    def test_login_unregistered_email(self):
        response = self.app.post(
            "/auth/login",
            data=json.dumps({"email": "unregistered@example.com", "password": "Password123"}),
            headers=self.headers
        )
        self.assertEqual(response.status_code, 401)
        self.assertIn("Invalid credentials", response.get_data(as_text=True))


if __name__ == "__main__":
    unittest.main()
