from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from pymongo import MongoClient


load_dotenv()

connection_uri = os.getenv('DATABASE_URI')

client = MongoClient(connection_uri)


app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Mock user database
users = {
    "test@example.com": "password123" # sign in to test dynamic navbar
}

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Check if the user exists and password matches
    if email in users and users[email] == password:
        return jsonify({"message": "Login successful!", "status": "success"}), 200
    else:
        return jsonify({"message": "Invalid credentials", "status": "fail"}), 401

if __name__ == '__main__':
    app.run(debug=True)
