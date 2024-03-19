# Imports for required libraries and modules
from flask import request, jsonify
from config import socketio, db, app, SQLException, json
from models import Users, Reminders, datetime, timedelta

global properties
# Main Route
@app.route('/')
def main():
    global properties
    json_file = open("properties.json", "r")
    json_data = json_file.read()
    properties = json.loads(json_data)
    print(str(properties))
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


@app.route("/get_users")
def get_users():
    users = Users.query.all()
    json_users = [user.to_json() for user in users]
    if len(users) == 0:
        return jsonify({"message": "no users found!"}), 404

    return jsonify(json_users), 200


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


@app.route("/get_ip", methods=["GET"])
def get_ip():
    return jsonify({"ip": request.remote_addr})


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


# Update the sensor power settings from the properties JSON file
@app.route("/update_sensor_settings/<sensor>")
def update_sensor_settings(sensor):
    global properties

    # const list with all compatible sensors
    sensors = ["accel", "ambient", "gesture", "proximity"]

    # if the provided sensor is not in the sensors
    if sensor not in sensors:
        return jsonify({"message": "sensor doesnt exist"}), 403

    # append the power property name to the end of the provided sensor
    if sensor != "ambient":
        sensor_prop = sensor + "Power"

    # append brightness adj to ambient light, as the ambient light sensor
    # only adjusts the brightness of the display
    else:
        sensor_prop = sensor + "BrightnessAdj"

    # flip the state of the sensor power mode
    properties[sensor_prop] = not properties[sensor_prop]

    # write the new contents to the JSON file
    with open("properties.json", "w") as file:
        json.dump(properties, file, indent=4)

    return jsonify(properties[sensor_prop])


@app.route("/set_user/<username>")
def





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
