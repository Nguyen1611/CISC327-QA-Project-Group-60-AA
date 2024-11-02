from flask import Flask
from flask_cors import CORS
from auth import auth_bp  # Import the Blueprint

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Register the auth Blueprint
app.register_blueprint(auth_bp, url_prefix='/auth')

@app.route('/')
def home():
    return "Welcome to the main app"




if __name__ == '__main__':
    app.run(debug=True)

