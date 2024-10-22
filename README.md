# CISC327-QA-Project
## Getting Started

### Prerequisites 

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation to work with (Front end)

1. **Clone the repository:**
2. cd your-repo-name/frontend
3. npm install
4. npm run dev

Available Scripts  
In the frontend directory, the following scripts are available:

npm run dev: Starts the development server with hot-reloading at http://localhost:3000.  
npm run build: Builds the app for production and outputs the files in the dist/ folder.  
npm run preview: Serves the production build locally.  
npm run lint: Lints your code for consistent formatting using ESLint.

### Installation to work with (back end)
To set up and run the Flask backend, follow these steps:

## Step 1: Set Up a Virtual Environment

## Navigate to the backend directory
cd ../backend
## Create a virtual environment:
python3 -m venv venv
## Activate the virtual environment
On Linux or macOS: source venv/bin/activate
On Window: venv\Scripts\activate

## Step 2: Install Flask Dependencies
pip install -r requirements.txt

## Step 3: Set Up the Flask Application
## Set the Flask application environment variable to point to the main Flask file (app.py):
export FLASK_APP=app.py

## Run the Flask Server
flask run

#### Remember to Make a New Branch to Do Your Work
