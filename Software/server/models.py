# Required Libraries and Modules
from config import db
from datetime import datetime, timedelta
from dataclasses import dataclass

# Users Table

class Users(db.Model):
    userID: int = db.Column(db.Integer, primary_key=True)
    username: str = db.Column(db.String(200), nullable=False)

    def __init__(self, username):
        self.username = username

    def to_json(self):
        return {
            'userID': self.userID,
            'userName': self.username
        }


# Reminders Table
class Reminders(db.Model):
    reminder_id: int = db.Column(db.Integer, primary_key=True)
    userID: int = db.Column(db.Integer, db.ForeignKey('users.userID'))
    event_title: str = db.Column(db.String(200))
    date_added: datetime.date = db.Column(db.Date, default=datetime.now())
    end_date: datetime.date = db.Column(db.Date, default=datetime.now() + timedelta(days=7))

    def __init__(self, userID, event_title, date_added, end_date):
        self.userID = userID
        self.event_title = event_title
        self.date_added = date_added
        self.end_date = end_date

    def to_json(self):
        return {
            'userID': self.userID,
            'eventTitle': self.event_title,
            'dateAdded': self.date_added.strftime('%Y-%m-%d'),
            'endDate': self.end_date.strftime('%Y-%m-%d')
        }
