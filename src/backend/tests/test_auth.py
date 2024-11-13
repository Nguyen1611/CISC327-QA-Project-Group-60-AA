#tests/.
import json
from dotenv import load_dotenv
import os
import pytest
from unittest.mock import patch
import bcrypt
import auth
from importlib import reload
from pymongo.errors import ConnectionFailure

# Load environment variables from .env.test for tests
load_dotenv(dotenv_path='../.env')

from app import app



@pytest.fixture
def client():
    return app.test_client()

@pytest.fixture
def mock_users_collection():
    with patch('auth.users_collection') as mock_collection:
        yield mock_collection

def test_login_success(client, mock_users_collection):
    # Mock a successful login scenario
    mock_users_collection.find_one.return_value = {
        "Email": "test@example.com",
        "Password": bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    }
    response = client.post('/auth/login', json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    assert response.get_json()["status"] == "success"

def test_login_invalid_credentials(client, mock_users_collection):
    # Mock invalid credentials scenario
    mock_users_collection.find_one.return_value = None
    response = client.post('/auth/login', json={
        "email": "invalid@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
    assert response.get_json()["message"] == "Invalid credentials"

def test_login_missing_fields(client):
    response = client.post('/auth/login', json={"email": "test@example.com"})
    assert response.status_code == 400
    assert response.get_json()["message"] == "Email and password are required."

def test_register_success(client, mock_users_collection):
    # Mock successful registration scenario
    mock_users_collection.find_one.return_value = None
    mock_users_collection.insert_one.return_value = True
    response = client.post('/auth/register', json={
        "email": "newuser@example.com",
        "password": "newpassword"
    })
    assert response.status_code == 201
    assert response.get_json()["status"] == "success"

def test_register_user_exists(client, mock_users_collection):
    # Mock user already exists scenario
    mock_users_collection.find_one.return_value = {"Email": "newuser@example.com"}
    response = client.post('/auth/register', json={
        "email": "newuser@example.com",
        "password": "newpassword"
    })
    assert response.status_code == 409
    assert response.get_json()["message"] == "User already exists."

def test_register_missing_fields(client):
    response = client.post('/auth/register', json={"email": "newuser@example.com"})
    assert response.status_code == 400
    assert response.get_json()["message"] == "Email and password are required."

def test_register_no_database(client, monkeypatch):
    monkeypatch.setattr('auth.users_collection', None)
    response = client.post('/auth/register', json={
        "email": "newuser@example.com",
        "password": "newpassword"
    })
    assert response.status_code == 500
    assert response.get_json()["message"] == "Database connection not available."


def test_no_database_connection(client, monkeypatch):
    # Simulate a scenario where the MongoDB client is None
    monkeypatch.setattr("auth.client", None)
    monkeypatch.setattr("auth.users_collection", None)

    # Test login when database connection is unavailable
    response = client.post('/auth/login', json={"email": "test@example.com", "password": "password123"})
    assert response.status_code == 500
    assert response.get_json()["message"] == "Database connection not available."

    # Test register when database connection is unavailable
    response = client.post('/auth/register', json={"email": "newuser@example.com", "password": "newpassword"})
    assert response.status_code == 500
    assert response.get_json()["message"] == "Database connection not available."


def test_valid_database_connection(client, monkeypatch):
    # Simulate a valid MongoDB connection
    with patch("auth.MongoClient") as mock_client:
        mock_db = mock_client.return_value["user_database"]
        mock_collection = mock_db["users"]
        monkeypatch.setattr("auth.users_collection", mock_collection)

        # Test that valid database connection initializes collections correctly
        assert auth.client is not None
        assert auth.users_collection is not None