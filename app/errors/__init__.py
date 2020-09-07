from flask import Blueprint

bluePrint = Blueprint('errors', __name__)

from app.errors import handlers
