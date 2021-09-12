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


@app.route('/times/')
@resp.check_user_authorization()
def times():
    return render_template('time_norm.html', user = session["username"])

@app.route('/routes/')
@resp.check_user_authorization()
def routes():
    return render_template('rout_template.html', user = session["username"])

@app.route('/logWidget/')
@resp.check_user_authorization()
def logWidget():
    return render_template('logWidget.html', user = session["username"])

@app.route('/reestr/')
@resp.check_user_authorization()
def reestr():
    return render_template('reestr.html', user = session["username"])

@app.route('/route_events/')
@resp.check_user_authorization()
def route_events():
    return render_template('route_events.html', user = session["username"])

@app.route('/export/')
@resp.check_user_authorization()
def export():
    return render_template('export.html', user = session["username"])

@app.route('/marklog_path/')
@resp.check_user_authorization()
def marklog_path():
    return render_template('marklog_path.html', user = session["username"])

@app.route('/marklog_dynamic_path/')
@resp.check_user_authorization()
def marklog_dynamic_path():
    return render_template('marklog_dynamic_path.html', user = session["username"])
    