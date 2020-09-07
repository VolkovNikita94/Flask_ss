from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime
from app import dataBase
from app import login


class User(UserMixin, dataBase.Model):
    id = dataBase.Column(dataBase.Integer, primary_key=True)
    username = dataBase.Column(dataBase.String(64), index=True, unique=True)
    password_hash = dataBase.Column(dataBase.String(128))
    local_folder = dataBase.Column(dataBase.String(128))

    about_me = dataBase.Column(dataBase.String(140))
    last_seen = dataBase.Column(dataBase.DateTime, default=datetime.utcnow())

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return '<User {}>'.format(self.username)


@login.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
