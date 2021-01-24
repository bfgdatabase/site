import os
from app import *
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from utils.responses import response_with
from utils import responses as resp
from api.login import login

@app.route('/admin/users')
@resp.admin_require()
def user_table():
    return render_template('user_table.html', username = session["username"])

@app.route('/admin/permission')
@resp.admin_require()
def permission_table():
    return render_template('permission_table.html', username = session["username"])

@app.route('/admin/roles')
@resp.admin_require()
def roles_table():
    return render_template('roles_table.html', username = session["username"])