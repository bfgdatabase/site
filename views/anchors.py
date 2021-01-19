from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from app import db
from utils.responses import response_with
from utils import responses as resp

@app.route('/anhcors')
@resp.check_user_authorization()
def ancors():
    return render_template('anchorsTable.html', user = session["username"])

