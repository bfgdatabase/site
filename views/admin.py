import os
from app import *
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from utils.responses import response_with
from utils import responses as resp
from api.login import login
from flask import send_file

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


@app.route('/download')
def downloadFile ():
    import csv
    path = "dump.csv"
    outfile = open(path, 'w')
    outcsv = csv.writer(outfile)
    records = MarksDB.query.all()
    [outcsv.writerow([column.name for column in MarksDB.__mapper__.columns])]
    [outcsv.writerow([getattr(curr, column.name) for column in MarksDB.__mapper__.columns]) for curr in records]
    outfile.close()
    filename = app.root_path + '/' +  path
    if os.path.isfile(filename):
        return send_file(path, as_attachment=True)

@app.route('/admin/errors')
@resp.check_user_authorization()
def error_table():
    return render_template('error_table.html', username = session["username"])
