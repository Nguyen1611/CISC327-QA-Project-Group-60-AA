from flask import Flask
from flask_cors import CORS
from auth import auth_bp  # Import the Blueprint
from payment import is_valid_payment, check_flight_availability, confirm_booking,  get_booking_history

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Register the auth Blueprint that handle signin and register
app.register_blueprint(auth_bp, url_prefix='/auth')

@app.route('/')
def home():
    return "Welcome to the main app"




if __name__ == '__main__':
    app.run(debug=True)

