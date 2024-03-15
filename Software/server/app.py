# Imports for required libraries and modules
from flask import request, jsonify
from config import socketio, db, app, SQLException
from models import Users, Reminders, datetime, timedelta


# Main Route
@app.route('/')
def main():
    return '<h1>Hello World! Flask server is running!</h1>', 200


# Database interaction endpoints
# Add user to DB
@app.route("/add_user/<username>", methods=["PUT"])
def add_user(username):
    try:
        new_user = Users(username)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "user added"}), 200
    except SQLException.DatabaseError:
        return "user not added", 400


# Add reminder to DB
@app.route("/add_reminder/<user_id>")
def add_reminder(user_id):
    try:
        data = request.get_json()
        event_title = data.get("event_title")
        date_added = data.get("date_added")
        end_date = data.get("end_date")

        new_event = Reminders(user_id, event_title, date_added, end_date)
        db.session.add(new_event)
        db.session.commit()
        return jsonify({"message": "event added"}), 200
    except SQLException.DatabaseError as ex:
        return jsonify({"message": f"{ex}"}), 400


# Retrieve reminders tied to user_id
@app.route("/find_events/<user_id>")
def find_events(user_id):
    events = Reminders.query.filter_by(userID=user_id).all()
    json_events = [event.to_json() for event in events]

    if len(json_events) == 0:
        return '<h1>no events found!</h1>', 200

    return jsonify({"message": "events received"}, json_events), 200


# Websockets
@socketio.on('connect')
def handle_connect():
    print('Client connected')


@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')


if __name__ == '__main__':
    # Create the DB model
    with app.app_context():
        db.create_all()
    socketio.run(app, debug=True, host="0.0.0.0", port=5174, allow_unsafe_werkzeug=True)
