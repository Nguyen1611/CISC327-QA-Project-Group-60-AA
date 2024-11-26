from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from bson.objectid import ObjectId  # Import ObjectId for MongoDB
from auth import auth_bp  # Import the Blueprint
from datetime import datetime


load_dotenv()

app = Flask(__name__)

# allow CORS
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})
CORS(auth_bp, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})


# Register the auth Blueprint that handle signin and register
app.register_blueprint(auth_bp, url_prefix='/auth')


# Get the MongoDB URI from the environment variable
client_uri = os.getenv('DATABASE_URI')
# Initialize MongoDB client
client = MongoClient(client_uri)
users_db = client['user_database']  # Adjusted to your user database name
users_collection = users_db['users']
flights_db = client['FlightDatabase']
flights_collection = flights_db['flights']

def is_valid_payment(payment_details):
    card_number = payment_details.get("cardNumber")
    #expiration_date = payment_details.get("expirationDate")
    cvv = payment_details.get("cvv")

    # Ensure that card_number and cvv are not None and meet length requirements
    if not card_number or not cvv:
        return False
    
    return len(card_number) == 16 and len(cvv) == 3  # Simplified for example

@app.before_request
def before_request():
    if request.method == "OPTIONS":
        # Handle preflight request
        response = jsonify({'message': 'OK'})
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'  # Replace with your frontend URL
        response.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response

@app.route("/checkFlightAvailability", methods=["POST"])
def check_flight_availability():
    data = request.json
    print("Received data:", data)  # Debug print
    flight_data = data.get("flight_data")

    # Check for required fields
    if not flight_data:
        return jsonify({"message": "Missing flight data."}), 400

    # Verify flight exists in the database
    flight = flights_collection.find_one({
        "fromLocation": flight_data["fromLocation"],
        "toLocation": flight_data["toLocation"],
        "date": flight_data["date"]
    })

    if not flight:
        return jsonify({"message": "Flight not found."}), 404

    # Check if there's an available seat
    available_seat = next((seat for seat in flight["Available Seats"] if seat["available"]), None)
    if not available_seat:
        return jsonify({"message": "No available seats on this flight."}), 400

    # Send flight details to the frontend for display
    return jsonify({
        "message": "Flight found",
        "flight": {
            "fromLocation": flight["fromLocation"],
            "toLocation": flight["toLocation"],
            "price": flight["price"],
            "date": flight["date"],
            "AvailableSeats": flight["Available Seats"]
        }
    }), 200



@app.route("/confirmBooking", methods=["GET", "POST"])
def confirm_booking():
    if request.method == "GET":
        return jsonify({"message": "This is a placeholder for the confirmBooking endpoint."}), 200

    try:
        data = request.json
        user_email = data.get("user_email")
        flight_data = data.get("flight_data")
        payment_details = data.get("payment_details")
        flight_id = data.get("flight_id")

        # Basic validation
        if not user_email:
            return jsonify({"message": "User email is missing."}), 400
        if not flight_data:
            return jsonify({"message": "Flight data is missing."}), 400
        if not payment_details:
            return jsonify({"message": "Payment details are missing."}), 400
        if not flight_id:
            return jsonify({"message": "Flight ID is missing."}), 400

        # Validate flight ID
        try:
            flight_id = ObjectId(flight_id)
        except InvalidId:
            return jsonify({"message": "Invalid Flight ID."}), 400

        # Find the flight
        flight = flights_collection.find_one({"_id": flight_id})
        if not flight:
            return jsonify({"message": "Flight not found."}), 404

        # Check for available seats
        available_seat = next((seat for seat in flight["Available Seats"] if seat["available"]), None)
        if not available_seat:
            return jsonify({"message": "No available seats on this flight."}), 400

        # Validate payment
        if not is_valid_payment(payment_details):
            return jsonify({"message": "Invalid payment."}), 400

        # Generate booking code
        booking_code = f"{flight_data['fromLocation'][:2].upper()}{flight_data['toLocation'][:2].upper()}-{datetime.now().strftime('%Y%m%d%H%M%S')}"

        # Update the flight document
        flights_collection.update_one(
            {"_id": flight_id, "Available Seats": {"$elemMatch": available_seat}},
            {"$set": {"Available Seats.$.available": False}}
        )

        # Remove the flight if no seats remain
        flight["Available Seats"].remove(available_seat)
        if not any(seat["available"] for seat in flight["Available Seats"]):
            flights_collection.delete_one({"_id": flight_id})
        else:
            flights_collection.update_one(
                {"_id": flight_id},
                {"$set": {"Available Seats": flight["Available Seats"]}}
            )

        # Add booking to user's history
        users_collection.update_one(
            {"Email": user_email},
            {"$addToSet": {"BookingHistory": booking_code}}
        )

        return jsonify({
            "message": "Booking confirmed successfully!",
            "flight": {
                "fromLocation": flight["fromLocation"],
                "toLocation": flight["toLocation"],
                "price": flight["price"],
                "date": flight["date"],
                "availableSeat": available_seat
            },
            "flight_code": booking_code
        }), 200

    except Exception as e:
        print("Error processing booking:", str(e))
        return jsonify({"message": "An error occurred during booking."}), 500




# Endpoint to get booking history for a user
@app.route("/getBookingHistory", methods=["GET"])
def get_booking_history():
    email = request.args.get("email")
    user = users_collection.find_one({"Email": email})
    
    if user:
        booking_history = user.get("BookingHistory", [])
        return jsonify({"bookingHistory": booking_history})
    
    return jsonify({"message": "User not found"}), 404


@app.route('/get-flights', methods=['GET'])
def get_flights():
    # flights_db = client['FlightDatabase']
    # collection = flights_db['flights']
    # flights = collection.find({}).limit(10)

    flights = flights_collection.find({}).limit(10)

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

