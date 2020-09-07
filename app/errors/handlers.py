from flask import render_template
from app import dataBase
from app.errors import bluePrint


@bluePrint.app_errorhandler(404)
def not_found_error():
    return render_template('errors/404.html'), 404


@bluePrint.app_errorhandler(500)
def internal_error(error):
    dataBase.session.rollback()
    return render_template('errors/500.html'), 500
