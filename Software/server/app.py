# Imports for required libraries and modules
from flask import request, jsonify
from config import socketio, db, app, SQLException, json
from models import Users, Reminders, datetime, timedelta
import os

global properties
# Main Route
@app.route('/')
def main():
    return '<h1>Hello World! Flask server is running!</h1>', 200


# Database interaction endpoints
# Add user to DB
@app.route("/add_user", methods=["POST"])
def add_user(username):
    try:
        new_user = Users(username)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "user added"}), 200
    except SQLException.DatabaseError:
        return "user not added", 400
    

# Deletes the user from the DB
@app.route("/delete_user/<user_id>")
def delete_user(user_id):
    if check_user_exists(user_id) is False:
        return jsonify({"message": "user doesnt exist"}), 403
    delete_user_reminders(user_id)
    try:
        user = Users.query.filter_by(user_id=user_id).first()
        db.session.delete(user)
        db.session.commit()
    except SQLException.DatabaseError as ex:
        return jsonify({"message": "user could not be deleted!"}), 403


# Get all current users in the DB
@app.route("/get_users")
def get_users():
    users = Users.query.all()
    json_users = [user.to_json() for user in users]
    if len(users) == 0:
        return jsonify({"message": "no users found!"}), 404

    return jsonify(json_users), 200


# Helper function to check if a username is available
def check_username(username):
    try:
        user = Users.query.filter_by(username=username).first()
        return user is not None
    except SQLException.DatabaseError as ex:
        return jsonify({"message": "user could not be searched!"}), 403


# Add reminder to DB
@app.route("/add_reminder/<user_id>", methods=["POST"])
def add_reminder(user_id):
    if check_user_exists(user_id) is False:
        return jsonify({"message": "user doesnt exist"}), 403
    try:
        data = request.get_json()
        event_title = data.get("reminderName")
        start_date = datetime.strptime(data.get("startDate"), '%Y-%m-%d').date()
        end_date = datetime.strptime(data.get("endDate"), '%Y-%m-%d').date()

        new_event = Reminders(user_id, event_title, start_date, end_date)
        db.session.add(new_event)
        db.session.commit()
        return jsonify({"message": "event added"}), 200
    except SQLException.DatabaseError as ex:
        return jsonify({"message": f"{ex}"}), 400


def check_user_exists(user_id):
    user = Users.query.filter_by(userID=user_id).first()
    return user is not None


# Retrieve reminders tied to user_id
@app.route("/get_reminders/<user_id>", methods=["GET"])
def get_reminders(user_id):
    events = Reminders.query.filter_by(userID=user_id).all()
    json_events = [event.to_json() for event in events]

    if len(json_events) == 0:
        return '<h1>no events found!</h1>', 200

    return jsonify(json_events), 200


# Delete reminder from DB
@app.route("/delete_reminder/<reminder_id>", methods=["DELETE"])
def delete_reminder(reminder_id):
    try:
        event = Reminders.query.filter_by(reminder_id=reminder_id).first()
        db.session.delete(event)
        db.session.commit()
        return jsonify({"message": "event deleted"}), 200

    except SQLException.DatabaseError as ex:
        return jsonify({"message": "event couldn't be deleted!"}), 400


# Delete user reminders from DB
# This function can only be accessed through delete_user
def delete_user_reminders(user_id):
    try:
        events = Reminders.query.filter_by(userID=user_id).all()
        if len(events) > 0:
            for i in range(len(events)):
                db.session.delete(events[i])
            db.session.commit()
    except SQLException.DatabaseError:
        return jsonify({"message": "user's events could not be deleted!"})


# Gets the IP of the device accessing the endpoint
@app.route("/get_ip", methods=["GET"])
def get_ip():
    return jsonify({"ip": request.remote_addr})


# properties.json endpoints
# Update the sensor power settings from the properties JSON file
@app.route("/update_sensor_settings/<sensor>", methods=["POST"])
def update_sensor_settings(sensor):
    # global in the loaded JSON properties file
    global properties

    # const list with all compatible sensors
    sensors = ["accelerometer", "ambient", "gesture", "proximity"]

    sensor = sensor.lower()

    # if the provided sensor is not in the sensors
    if sensor not in sensors:
        return jsonify({"message": "sensor doesnt exist"}), 403

    # flip the state of the sensor power mode
    properties[sensor] = not properties[sensor]

    # write the new contents to the JSON file
    with open("properties.json", "w") as file:
        json.dump(properties, file, indent=2)

    # Return the new state of the sensor power
    # True = enabled
    # False = disabled
    return jsonify(properties[sensor])


# Retrieves all current settings in the properties.json
@app.route("/get_settings", methods=["GET"])
def get_settings():
    return jsonify(properties)


# Update the current user through the web application
@app.route("/set_user/<username>")
def set_user(username):
    global properties

    # If the user doesnt exist in the DB, prompt an errors
    if check_username(username) is False:
        return jsonify({"message": "user doesnt exist!"}), 403

    # Attempt to query the DB
    try:
        # Grab the specified user and set the defaultUser field to the username
        user = Users.query.filter_by(username=username).first()
        properties["defaultUser"] = user.username

        # Write to the JSON file
        with open("properties.json", "w") as file:
            json.dump(properties, file, indent=2)

        # Return a status message
        return jsonify({"message": "username updated in config"}), 200

    # If an error occurs, prompt an error message
    except SQLException.DatabaseError as ex:
        return jsonify({"message": "user could not be updated in config file!"}), 403


# Websockets
@socketio.on('connect')
def handle_connect():
    print('Client connected')


@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')


if __name__ == '__main__':
    current_directory = os.path.dirname(os.path.abspath(__file__))
    # Construct the relative path to properties.json
    file_path = os.path.join(current_directory, "properties.json")

    json_file = open(file_path, "r")
    json_data = json_file.read()
    properties = json.loads(json_data)
    print(str(properties))
    # Create the DB model
    with app.app_context():
        db.create_all()
    socketio.run(app, debug=True, host="0.0.0.0", port=5174, allow_unsafe_werkzeug=True)
