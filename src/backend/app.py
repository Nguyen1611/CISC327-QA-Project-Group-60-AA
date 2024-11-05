from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from bson.objectid import ObjectId  # Import ObjectId for MongoDB
from auth import auth_bp  # Import the Blueprint
from payment import is_valid_payment, check_flight_availability, confirm_booking,  get_booking_history

load_dotenv("../.env")

# Get the MongoDB URI from the environment variable
client_uri = os.getenv('DATABASE_URI')
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

# Create a MongoDB client

# Check if the server is available
client.admin.command('ismaster')
print("MongoDB connection successful.")

# Access database
if client:
    db = client['user_database']
    users_collection = db['users']
else:
    db = None
    users_collection = None


# Initialize MongoDB client
client = MongoClient(client_uri or "mongodb://localhost:27017/")
db = client.user_database  # Adjusted to your user database name
users_collection = db.users
flights_collection = db.flights


def is_valid_payment(payment_details):
    # Mock payment validation logic
    card_number = payment_details.get("cardNumber")
    expiration_date = payment_details.get("expirationDate")
    cvv = payment_details.get("cvv")
    return len(card_number) == 16 and len(cvv) == 3  # Simplified for example


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


@app.route("/confirmBooking", methods=["POST"])
def confirm_booking():
    try:
        data = request.json
        print("Received data:", data)

        user_email = data.get("email")
        flight_data = data.get("flight_data")
        payment_details = data.get("payment_details")

        # Basic validation for required fields
        if not all([user_email, flight_data, payment_details]):
            return jsonify({"message": "Missing required information."}), 400

        # Verify the flight still exists (additional check for confirmation step)
        flight = flights_collection.find_one({
            "fromLocation": flight_data["fromLocation"],
            "toLocation": flight_data["toLocation"],
            "date": flight_data["date"]
        })
        if not flight:
            return jsonify({"message": "Flight not found."}), 404

        # Check if there's still an available seat
        available_seat = next((seat for seat in flight["Available Seats"] if seat["available"]), None)
        if not available_seat:
            return jsonify({"message": "No available seats on this flight."}), 400

        # Process payment validation
        if not is_valid_payment(payment_details):
            return jsonify({"message": "Invalid payment."}), 400

        # Generate booking code
        booking_code = f"{flight_data['fromLocation'][:2].upper()}{flight_data['toLocation'][:2].upper()}-{datetime.now().strftime('%Y%m%d%H%M%S')}"

        # Add the booking code to user's booking history
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
        print("Error processing booking:", str(e))  # Log the error
        return jsonify({"message": "An error occurred."}), 500




# Endpoint to get booking history for a user
@app.route("/getBookingHistory", methods=["GET"])
def get_booking_history():
    email = request.args.get("email")
    user = users_collection.find_one({"Email": email})
    
    if user:
        booking_history = user.get("BookingHistory", [])
        return jsonify({"bookingHistory": booking_history})
    
    return jsonify({"message": "User not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)

