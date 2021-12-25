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
    
@app.route('/tables/equipments')
@resp.check_user_authorization()
def equipment_table():
    return render_template('equipment_table.html', username = session["username"])

@app.route('/tables/specs')
@resp.check_user_authorization()
def spec_table():
    return render_template('spec_table.html', username = session["username"])

@app.route('/tables/orders')
@resp.check_user_authorization()
def order_table():
    return render_template('order_table.html', username = session["username"])

@app.route('/tables/structure')
@resp.check_user_authorization()
def structure_table():
    return render_template('structure_table.html', username = session["username"])

@app.route('/tables/batches')
@resp.check_user_authorization()
def batches_table():
    return render_template('batches_table.html', username = session["username"])
    
@app.route('/tables/orders_location')
@resp.check_user_authorization()
def orders_location():
    return render_template('orders_location.html', username = session["username"])
    
