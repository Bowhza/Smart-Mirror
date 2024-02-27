# Imports for required libraries and modules
from flask import request, jsonify
from config import socketio, db, app
from models import Users, Reminders


# Main Route
@app.route('/')
def main():
    return '<h1>Hello World! Flask server is running!</h1>', 200


# Websockets
@socketio.on('connect')
def handle_connect():
    print('Client connected')


@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')


if __name__ == '__main__':
    socketio.run(app, debug=True, host="0.0.0.0", port=5174, allow_unsafe_werkzeug=True)
