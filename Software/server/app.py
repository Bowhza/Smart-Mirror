# Imports for required libraries and modules
from flask import request, jsonify
from config import socketio, db, app, SQLException, json
from flask_socketio import emit
from models import Users, Reminders, datetime, timedelta
import os
global properties


# Main Route
@app.route('/')
def main():
    return '<h1>Hello World! Flask server is running!</h1>', 200


# Database interaction endpoints
# User DB Relations
# Add user to DB
@app.route("/add_user/<username>", methods=["POST"])
def add_user(username):
    # Replace any white space with an empty string
    username = username.replace(" ", "")

    # If the username isn't alphanumeric, return an error
    if username.isalnum() is False:
        return jsonify({"message": "Invalid Format! Usernames must be alphanumeric"}), 400

    # username = username.strip()
    # Check to see if the username already exists in the DB
    # If so, return an error stating so
    if check_username(username) is True:
        return jsonify({"message": "Username Taken!"}), 406

    # Attempt to enter the user into the DB
    try:
        # Create the new user and add to the DB
        new_user = Users(username)
        db.session.add(new_user)
        db.session.commit()

        users = Users.query.all()
        if len(users) == 1:
            set_user(new_user.userID)

        # Return the ok status code and the message
        return jsonify({"message": "User Added"}), 200

    # If a DB error occurs, return an error message
    except SQLException.DatabaseError:
        return jsonify({"message": "User Not Added"}), 400
    

# Deletes the user from the DB
@app.route("/delete_user/<user_id>", methods=["DELETE"])
def delete_user(user_id):
    global properties

    # check if the user exists, if not, return an error message
    if check_user_exists(user_id) is False:
        return jsonify({"message": "User Doesnt Exist"}), 403

    # If the user has any reminders, delete all of them
    if len(Reminders.query.filter_by(userID=user_id).all()) > 0:
        delete_user_reminders(user_id)

    # Attempt to delete the user from the DB
    try:
        # Get the user from the userID and delete them
        user = Users.query.filter_by(userID=user_id).first()
        db.session.delete(user)
        db.session.commit()

        # if the user is currently set as the default user in properties.json...
        # Query the database for all current users
        if properties["defaultUser"] == user.username or properties["defaultUser"] == "":
            users = Users.query.all()

            # If there are any users in the DB, set the default user to the first user
            if len(users) >= 1:
                user = Users.query.first()
                set_user(user.userID)

            # Else, set the property to blank
            else:
                properties["defaultUser"] = ""

            # write the new contents to the JSON file
            with open("properties.json", "w") as file:
                json.dump(properties, file, indent=2)

    # If a DB error occurs, return an error message
    except SQLException.DatabaseError as ex:
        return jsonify({"message": "User Could Not be Deleted!"}), 403

    # Return a message stating that the user was deleted from the DB
    return jsonify({"message": "User Deleted from Database!"}), 200

# Clears everything in the DB
@app.route("/clear_db")
def clear_db():
    # Attempt to clear the DB
    try:
        # Grab all current users in the DB
        users = Users.query.all()

        # Iterate through each user
        for user in users:

            # Grab the user id and delete the user
            # This will also delete any user reminders tied to the user id
            user_id = user.userID
            delete_user(user_id)

    # If a DB error occurs, return an error message
    except SQLException.DatabaseError as ex:
        return jsonify({"message": "users could not be deleted!"}), 403

    # Return a message stating the DB was cleared
    return jsonify({"message": "Database cleared!"})


# Get all current users in the DB
@app.route("/get_users", methods=["GET"])
def get_users():
    # Grab all users in the DB
    users = Users.query.all()

    # If no users are inside the DB, return a message stating so
    # if len(users) == 0:
    #     return jsonify({"message": "no users found!"}), 404

    # Convert the users info into JSON and store them into a list
    json_users = [user.to_json() for user in users]

    # Return the users JSON info
    return jsonify({"users": json_users, "default": properties["defaultUser"], "id": properties["defaultUserID"]}), 200

# Update the current user through the web application
@app.route("/set_user/<user_id>", methods=["POST"])
def set_user(user_id):
    global properties

    # # If the user doesn't exist in the DB, prompt an errors
    if check_user_exists(user_id) is False:
        return jsonify({"message": "User doesnt exist!"}), 403

    # Attempt to query the DB
    try:
        # Grab the specified user and set the defaultUser field to the username
        user = Users.query.filter_by(userID=user_id).first()

        properties["defaultUser"] = user.username
        properties["defaultUserID"] = user.userID

        # Write to the JSON file
        with open("properties.json", "w") as file:
            json.dump(properties, file, indent=2)

        # Return a status message
        return jsonify({"message": "Default Username Updated!"}), 200

    # If an error occurs, prompt an error message
    except SQLException.DatabaseError as ex:
        return jsonify({"message": "User could not be Updated in Config File!"}), 403


# @app.route("/clear_nulls")
# def clear_nulls():
#     try:
#         reminders = Reminders.query.filter_by(userID=None).all()
#         for reminder in reminders:
#             db.session.delete(reminder)
#         db.session.commit()
#     except SQLException.DatabaseError as ex:
#         return jsonify({"message": "cannot delete nulls!"})
#
#     return jsonify({"message": "nulls removed!"})


# Helper function to check if a username is available
def check_username(username):
    # Attempt to query the DB
    try:
        # Grab all the users in the DB and store the lowercase versions in a seperate list
        users = Users.query.all()
        lowercase_users = [user.username.lower() for user in users]

        # return whether the username is in the lowercase username collection
        return username.lower() in lowercase_users

    # If a DB error occurs, return an error message
    except SQLException.DatabaseError as ex:
        return jsonify({"message": "user could not be searched!"}), 403

# Helper function to check if a user exists in the DB through userID
def check_user_exists(user_id):
    # Filter the user by userID and return whether it exists or not
    user = Users.query.filter_by(userID=user_id).first()
    return user is not None


# Add reminder to DB
@app.route("/add_reminder/<user_id>", methods=["POST"])
def add_reminder(user_id):
    if check_user_exists(user_id) is False:
        return jsonify({"message": "User Doesn't Exist"}), 403
    try:
        data = request.get_json()
        # date_string = data["startDate"]
        # date_part, time_part = date_string.split("T")
        # print(date_string)
        # print(date_part)
        # print(time_part)

        for field in data:
            if field is None:
                return jsonify({"message": "Fields cannot be left empty"})

        event_title = data.get("title")
        event_desc = data.get("description")
        start_date = datetime.strptime(data.get("startDate"), '%Y-%m-%dT%H:%M')
        # start_date = datetime.strptime(data.get("startDate"), '%Y-%m-%d').date()
        # start_date = datetime.strptime(date_part + " " + time_part + "+0000", "%Y-%m-%d %H:%M:%S.%f%z").date()
        end_date = datetime.strptime(data.get("endDate"), '%Y-%m-%dT%H:%M')
        # end_date = datetime.strptime(data.get("endDate"), '%Y-%m-%d').date()



        new_event = Reminders(user_id, event_title, event_desc, start_date, end_date)
        db.session.add(new_event)
        db.session.commit()
        return jsonify({"message": "Reminder Added!"}), 200
    except SQLException.DatabaseError as ex:
        return jsonify({"message": f"{ex}"}), 400


# Retrieve reminders tied to user_id
@app.route("/get_reminders/<user_id>", methods=["GET"])
def get_reminders(user_id):
    # Query the DB for all reminders tied to the provided userID
    events = Reminders.query.filter_by(userID=user_id).all()

    # Create the JSON reminder objects and store them in a list
    json_events = [event.to_json() for event in events]

    # if len(json_events) == 0:
    #     return jsonify({"message": "No Events Found!"}), 200

    # Return the list of JSON events
    return jsonify(json_events), 200


# Delete reminder from DB
@app.route("/delete_reminder/<reminder_id>", methods=["DELETE"])
def delete_reminder(reminder_id):
    # Attempt to delete the reminder from the DB
    try:
        # Query the DB for the reminder and delete
        event = Reminders.query.filter_by(reminder_id=reminder_id).first()
        db.session.delete(event)
        db.session.commit()

        #
        return jsonify({"message": "Reminder Deleted!"}), 200

    except SQLException.DatabaseError as ex:
        return jsonify({"message": "Reminder Could not be Deleted!"}), 400


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


@app.route("/update_reminder/<reminder_id>", methods=["PUT"])
def update_reminder(reminder_id):
    data = request.get_json()

    for field in data:
        if field is None:
            return jsonify({"message": "Fields cannot be empty"})
    try:
        reminder = Reminders.query.filter_by(reminder_id=reminder_id)
        if reminder is None:
            return jsonify({"message": "Reminder doesn't exist!"})
        reminder.event_title = data.get("title")
        reminder.event_desc = data.get("description")
        reminder.date_added = datetime.strptime(data.get("startDate"), '%Y-%m-%dT%H:%M')
        reminder.end_date = datetime.strptime(data.get("endDate"), '%Y-%m-%dT%H:%M')
        db.session.commit()
        return jsonify({"message": "Reminder Updated!"})
    except SQLException.DatabaseError as ex:
        return jsonify({"message": "Reminder could not be updated!"})


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

    try:
        # flip the state of the sensor power mode
        properties[sensor] = not properties[sensor]

        # write the new contents to the JSON file
        with open("properties.json", "w") as file:
            json.dump(properties, file, indent=2)

        # Return the new state of the sensor power
        # True = enabled
        # False = disabled
        return jsonify(properties[sensor])

    except Exception as ex:
        return jsonify({"message": "properties file cannot be read!"})


# Retrieves all current settings in the properties.json
@app.route("/get_settings", methods=["GET"])
def get_settings():
    return jsonify(properties), 200

@app.route("/get_default_user_id")
def get_default_user_id():
    try:
        user = Users.query.filter_by(username=properties["defaultUser"])
        return (user.to_json()).userID, 200
    except SQLException.DatabaseError as ex:
        return jsonify({"message": "User ID could not be Retrieved!"}), 400


@app.route("/update_location/<location>")
def update_location(location):
    global properties
    location = location.capitalize()

    try:
        properties["defaultLocation"] = location

        # write the new contents to the JSON file
        with open("properties.json", "w") as file:
            json.dump(properties, file, indent=2)

        # Return the new state of the sensor power
        # True = enabled
        # False = disabled
        return jsonify(properties["defaultLocation"])

    except Exception as ex:
        return jsonify({"message": "location cannot be updated!"})


@app.route("/update_time_format/<format>", methods=["POST"])
def update_time_format(format):
    global properties
    formats = ["en-uk", "en-us"]
    if format not in formats:
        return jsonify({"message": "Invalid format!"}), 400

    try:
        properties["timeFormat"] = format

        with open("properties.json", "w") as file:
            json.dump(properties, file, indent=2)
        return jsonify(properties["timeFormat"]), 200

    except Exception as ex:
        return jsonify({"message": "Cannot Update Properties File!"}), 400


# Websockets

# Set to store the connected clients
connected_clients = set()

@socketio.on('connect')
def handle_connect():
    connected_clients.add(request.sid)
    print(f'Connected Clients: {len(connected_clients)}')
    print('Client connected')


@socketio.on('disconnect')
def handle_disconnect():
    connected_clients.remove(request.sid)
    print(f'Connected Clients: {len(connected_clients)}')
    print('Client disconnected')


@socketio.on('update')
def handle_update(message):
    print(f'Received Message: {message}')
    emit('update', f'Updated', broadcast=True)


# @socketio.on('reminders')
# def handle_reminder(message):
#     print(f'Received Message: {message}')
#     emit('reminder', f'Updated', broadcast=True)


if __name__ == '__main__':
    try:
        current_directory = os.path.dirname(os.path.abspath(__file__))
        print(current_directory)
        # Construct the relative path to properties.json
        file_path = os.path.join(current_directory, "properties.json")
        json_file = open(file_path, "r")
        json_data = json_file.read()
        properties = json.loads(json_data)
        print(str(properties))

    except Exception as ex:
        print("Cannot load JSON file!")
    # Create the DB model
    with app.app_context():
        db.create_all()
    socketio.run(app, debug=True, host="0.0.0.0", port=5174, allow_unsafe_werkzeug=True)
