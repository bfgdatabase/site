import os
from app import *
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from utils.responses import response_with
from utils import responses as resp
from api.login import login

@app.route('/settings/marks_params')
@resp.check_user_authorization()
def marks_params():
    return render_template('marks_params.html', username = session["username"])

@app.route('/settings/marks_group')
@resp.check_user_authorization()
def marks_group():
    return render_template('marks_group.html', username = session["username"])
