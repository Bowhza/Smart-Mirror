# Required libraries and modules
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy

# Create App instance
app = Flask(__name__)
# Configure SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")
# Configure CORS
CORS(app)
# Set Secret Key
app.config['SECRET_KEY'] = 'CMPE2965CapProj'
# Configure SQLAlchemy with an SQLite Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Integrate SQLAlchemy with Flask
db = SQLAlchemy(app)
