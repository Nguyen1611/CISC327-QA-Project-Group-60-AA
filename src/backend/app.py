from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from bson.objectid import ObjectId  # Import ObjectId for MongoDB
from auth import auth_bp  # Import the Blueprint
from payment import is_valid_payment, check_flight_availability, confirm_booking,  get_booking_history

load_dotenv()

# Get the MongoDB URI from the environment variable
client_uri = os.getenv('FLIGHTDATABASE_URI')
client = MongoClient(client_uri)


app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests


# Register the auth Blueprint that handle signin and register
app.register_blueprint(auth_bp, url_prefix='/auth')

@app.route('/get-flights', methods=['GET'])
def get_flights():
    flights_db = client['FlightDatabase']
    collection = flights_db['flights']
    flights = collection.find({}).limit(10)

    # Convert documents to JSON-serializable format
    flights_list = []
    for flight in flights:
        flight['_id'] = str(flight['_id'])  # Convert ObjectId to string
        flights_list.append(flight)

    return jsonify({"flights": flights_list})


@app.route('/get-flight/<string:flight_id>', methods=['GET'])
def get_flight(flight_id):
    # Convert flight_id to ObjectId for MongoDB
    try:
        flight_id_obj = ObjectId(flight_id)
    except Exception:
        return jsonify({'error': 'Invalid flight ID format.'}), 400

    flights_db = client['FlightDatabase']
    collection = flights_db['flights']
    
    # Fetch the flight with the specified ID
    flight = collection.find_one({"_id": flight_id_obj})

    if flight:
        flight['_id'] = str(flight['_id'])  # Convert ObjectId to string
        return jsonify({"flight": flight}), 200
    else:
        return jsonify({'error': 'Flight not found'}), 404




if __name__ == '__main__':
    app.run(debug=True)

