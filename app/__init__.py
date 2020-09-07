import os
import logging
from logging.handlers import SMTPHandler
from logging.handlers import RotatingFileHandler
from flask import Flask
from config import Config
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_bootstrap import Bootstrap

# Объявление всего.
dataBase = SQLAlchemy()
migrate = Migrate()
login = LoginManager()
login.login_view = 'auth.login_usr'
login.login_message = 'Sign in or register to access'
bootstrap = Bootstrap()


def create_app(config_class=Config):
    # Само приложение
    app_flask = Flask(__name__)
    app_flask.config.from_object(config_class)

    dataBase.init_app(app_flask)
    migrate.init_app(app_flask, dataBase)
    login.init_app(app_flask)
    bootstrap.init_app(app_flask)

    from app.errors import bluePrint as errors_BP
    app_flask.register_blueprint(errors_BP)

    from app.auth import bluePrint as auth_BP
    app_flask.register_blueprint(auth_BP)

    from app.main import bluePrint as main_BP
    app_flask.register_blueprint(main_BP)

    # Настройка регистратора электронной почты
    if not app_flask.debug:
        if app_flask.config['MAIL_SERVER']:
            auth = None
            if app_flask.config['MAIL_USERNAME'] or app_flask.config['MAIL_PASSWORD']:
                auth = (app_flask.config['MAIL_USERNAME'], app_flask.config['MAIL_PASSWORD'])
            secure = None
            if app_flask.config['MAIL_USE_TLS']:
                secure = ()
            mail_handler = SMTPHandler(
                mailhost=(app_flask.config['MAIL_SERVER'], app_flask.config['MAIL_PORT']),
                fromaddr='no-reply@' + app_flask.config['MAIL_SERVER'],
                toaddrs=app_flask.config['ADMINS'],
                subject='Microbial failure',
                credentials=auth,
                secure=secure
            )
            mail_handler.setLevel(logging.ERROR)
            app_flask.logger.addHandler(mail_handler)

    # Настройка журналирования ошибок в файлы
    if not app_flask.debug:
        if not os.path.exists('logs'):
            os.mkdir('logs')
        # Заводим новый лог-файл
        file_handler = RotatingFileHandler('logs/microbial.log', maxBytes=65536, backupCount=10)
        file_handler.setFormatter(
            logging.Formatter('%(asctime)s %(levelname)s:'
                              ' %(message)s [int %(pathname)s:%(lineno)d]')
        )
        file_handler.setLevel(logging.INFO)
        # Настраиваем приложение на его использование
        app_flask.logger.addHandler(file_handler)
        app_flask.logger.setLevel(logging.INFO)
        app_flask.logger.info('Microbial startup')

    return app_flask


from app import models
