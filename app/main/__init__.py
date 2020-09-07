from flask import Blueprint

bluePrint = Blueprint('main', __name__)

from app.main import routes

