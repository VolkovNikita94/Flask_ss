# -*- coding: utf-8 -*-
from flask import render_template, flash, redirect, url_for, request
from werkzeug.urls import url_parse
from flask_login import current_user, login_user, logout_user
from app import dataBase
from app.auth import bluePrint
from app.auth.forms import LoginForm
from app.models import User


# По умолчанию функция просмотра принимает только запрос GET,
# это переопределяется в methods
@bluePrint.route('/login', methods=['GET', 'POST'])
def login_usr():
    # Так медленнее, но лучше читаемость.
    form = LoginForm()
    # Уже залогинены
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    # Отправили заполненную форму
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('auth.login_usr'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            return redirect(url_for('main.index'))
        return redirect(next_page)
    # Пришли сюда в первый раз
    return render_template('auth/login.html', title='Вход в систему', form=form)


@bluePrint.route('/logout')
def logout_usr():
    logout_user()
    return redirect(url_for('main.index'))

