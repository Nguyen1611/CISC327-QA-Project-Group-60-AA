"""
This file is to init user_data using code. This will not be runned in main, just for reviewing process.
"""

from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv
import bcrypt
import os

# load from .env (make sure to create .env at src root)
load_dotenv()
mongo_uri = os.getenv("DATABASE_URI")

# Check if the URI was successfully retrieved
if not mongo_uri:
    raise ValueError("MONGODB_URI not found in environment variables.")

# Create a MongoDB client
try:
    client = MongoClient(mongo_uri)
    # Check if the server is available
    client.admin.command('ismaster')
    print("MongoDB connection successful.")
except ConnectionFailure:
    print("MongoDB connection failed.")
    client = None

## Access or create database
db = client['user_database']

#Access or create a collection
users_collection = db['users']

# Sample user creation with hashed password
password = "example_password"  # Replace with the actual password input
hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

# init structure (Please following this format)
sample_user = {
    "Email": "example_user@gmail.com",
    "Password": hashed_password.decode('utf-8'),
    "BookingHistory": ["VN123"] # element are the booked flight code
}

users_collection.insert_one(sample_user)
print("Database and collection initialized.")