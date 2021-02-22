from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from app import db
from utils.responses import response_with
from utils import responses as resp


@app.route('/anchorsandzones/<int:id_location>/')
@resp.check_user_authorization()
def anchorsandzones(id_location):
    return render_template('anchorsandzones_map.html', user = session["username"], id_location = id_location)
