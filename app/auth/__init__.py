from flask import Blueprint

bluePrint = Blueprint('auth', __name__)

from app.auth import routes
