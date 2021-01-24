import os
from app import *
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from utils.responses import response_with
from utils import responses as resp
from api.login import login

@app.route('/tables/tags')
@resp.check_user_authorization()
def tags_table():
    return render_template('tags_table.html', username = session["username"])

@app.route('/tables/gates')
@resp.check_user_authorization()
def gates_table():
    return render_template('gates_table.html', username = session["username"])

@app.route('/tables/marks')
@resp.check_user_authorization()
def marks_table():
    return render_template('marks_table.html', username = session["username"])

@app.route('/tables/anchors')
@resp.check_user_authorization()
def anchors_table():
    return render_template('anchors_table.html', username = session["username"])
    
@app.route('/tables/zones')
@resp.check_user_authorization()
def zones_table():
    return render_template('zones_table.html', username = session["username"])
    