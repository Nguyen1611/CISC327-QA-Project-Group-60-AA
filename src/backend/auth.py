"""
Handle backend logic for login, register
"""

from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv
import bcrypt
import os
# from bson import ObjectId

# Create a Blueprint for authentication routes
auth_bp = Blueprint('auth', __name__)

# load from .env (make sure to create .env at src root)
load_dotenv("../.env")
mongo_uri = os.getenv("DATABASE_URI")

# Check if the URI was successfully retrieved
if not mongo_uri:
    raise ValueError("DATABASE_URI not found in environment variables.")

# Create a MongoDB client
try:
    client = MongoClient(mongo_uri)
    # Check if the server is available
    client.admin.command('ismaster')
    print("MongoDB connection successful.")
except ConnectionFailure:
    print("MongoDB connection failed.")
    client = None

# Access database
if client:
    db = client['user_database']
    users_collection = db['users']
else:
    db = None
    users_collection = None

"""
Handle log in
"""
@auth_bp.route('/login', methods=['POST'])
def login():
    if users_collection is None:
        return jsonify({"message": "Database connection not available.", "status": "error"}), 500

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required.", "status": "fail"}), 400

    # Find the user by email
    user = users_collection.find_one({"Email": email})
    if user and bcrypt.checkpw(password.encode('utf-8'), user['Password'].encode('utf-8')):
        return jsonify({"message": "Login successful!", "status": "success"}), 200
    else:
        return jsonify({"message": "Invalid credentials", "status": "fail"}), 401


"""
Handle register
"""
@auth_bp.route('/register', methods=['POST'])
def register():
    if users_collection is None:
        return jsonify({"message": "Database connection not available.", "status": "error"}), 500

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required.", "status": "fail"}), 400

    # Check if the user already exists
    if users_collection.find_one({"Email": email}):
        return jsonify({"message": "User already exists.", "status": "fail"}), 409

    # Hash the password before storing
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    new_user = {
        "Email": email,
        "Password": hashed_password.decode('utf-8'),  # Store the hashed password
        "BookingHistory": []  # Initialize with an empty booking history
    }

    # Insert the new user into the collection
    users_collection.insert_one(new_user)
    return jsonify({"message": "User registered successfully.", "status": "success"}), 201


# """
# THIS IS ONLY FOR DEVELOPMENT PROCESS
# """
# @auth_bp.route('/users', methods=['GET'])
# def list_users():
#     if users_collection is None:
#         return jsonify({"message": "Database connection not available.", "status": "error"}), 500

#     try:
#         # Convert MongoDB documents to a JSON-serializable format
#         users = list(users_collection.find())
#         for user in users:
#             # Convert ObjectId to string
#             user['_id'] = str(user['_id'])

#         return jsonify(users), 200
#     except Exception as e:
#         return jsonify({"message": "Error occurred while fetching users.", "status": "error"}), 500
