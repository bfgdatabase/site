import os
from app import *
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from utils.responses import response_with
from utils import responses as resp
from api.login import login
import re 
regex = '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'


def check_name(test_str):  
    res = test_str != '' and all(chr.isalpha() or chr.isspace() for chr in test_str) 
    return res 

def check(email):  
    if(re.search(regex,email)):  
        return True           
    else:  
        return False

@app.route('/login', methods = ['GET', 'POST'])
def login_page():
    if "login" in session:
        return redirect(url_for('Base'))
    if request.method == "POST":
        login = request.form["login"]
        password = request.form["password"] 
        query = UsersDB.authentificate(login = login ,password =  password)
        if(not query):
            flash(u'Неправильный логин/пароль', 'info')
            return render_template('login.html')
        session["username"] = query.username
        session["login"] = query.login
        session["role"] = query.role   
        return redirect(url_for('Base'))
    return render_template('login.html')
    
@app.route('/logout')
def logout_page():
    session.pop("username", None)
    session.pop("login", None)
    session.pop("role", None)
    return redirect(url_for('login_page'))

@app.route('/')
@resp.check_user_authorization()
def Base():
    return render_template('base_template.html', username = session["username"])

@app.route('/registration', methods = ['GET', 'POST'])
def user_registration():
    if request.method == "POST":
        username = request.form["username"]
        login = request.form["login"]
        password = request.form["password"] 
        phone = request.form["phone"] 
        email = request.form["email"] 

        isValid = True
        if not (check_name(username)):
            flash(u'Некорректное имя пользователя', 'info')
            isValid = False

        if not (login.isalnum()):
            flash(u'Некорректный логин', 'info')
            isValid = False

        if not (password.isalnum()):
            flash(u'Некорректный пароль', 'info')
            isValid = False

        if not (phone.isalnum()):
            flash(u'Некорректный телефон', 'info')
            isValid = False

        if not (check(email)):
            flash(u'Некорректный email', 'info')
            isValid = False

        if (isValid):
            try:
                query = UsersDB()
                query.username = username
                query.login = login
                query.phone = phone
                query.email = email
                pass_hash = bcrypt.generate_password_hash(password, 10)  
                pass_hash_decoded = pass_hash.decode('utf-8') 
                query.password_hash = pass_hash_decoded
                query.role = ''
                db.session.add(query)
                db.session.commit()    
                flash(u'Новый пользоваиель добавлен', 'info')
                return render_template('login.html')

            except:
                flash(u'ошибка', 'info')

    return render_template('registration.html')

