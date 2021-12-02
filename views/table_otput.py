import os
from app import *
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from utils.responses import response_with
from utils import responses as resp
from api.login import login

@app.route('/tables/tests')
@resp.check_user_authorization()
def table_tests():
    return render_template('table_tests.html', username = session["username"])

