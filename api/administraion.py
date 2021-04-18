from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc
from config import Configuration
from app import db
import glob
import os

DB_URL = 'postgresql://{user}:{pw}@{url}/{db}'.format(user=Configuration.POSTGRES_USER,pw=Configuration.POSTGRES_PW,url=Configuration.POSTGRES_URL,db=Configuration.POSTGRES_DB)

@app.route('/api/db/dump/<string:name>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Dump database', tags=['administration'])
def dump_db(name):
    if("login" in session) == False:
        return response_with(FORBIDDEN_403)
    if not (session["role"] == 'administrator'):
        return response_with(FORBIDDEN_403)
    res = os.system('pg_dump ' + DB_URL + ' > ' + 'db_backup/' + name + '.sql')
    if (res == 0):
        return response_with(resp.SUCCESS_200)
    else:
        return response_with(resp.SERVER_ERROR_500)
docs.register(dump_db)

@app.route('/api/db/restore/<string:name>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Restore database', tags=['administration'])
def restore_db(name):
    if("login" in session) == False:
        return response_with(FORBIDDEN_403)
    if not (session["role"] == 'administrator'):
        return response_with(FORBIDDEN_403)
    res = os.system('psql ' + DB_URL + ' < ' + 'db_backup/' + name + '.sql')
    if (res == 0):
        return response_with(resp.SUCCESS_200)
    else:
        return response_with(resp.SERVER_ERROR_500)
docs.register(restore_db)

'''
@app.route('/api/db/get_backups/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get backup names', tags=['administration'])
def backup_names():
    if("login" in session) == False:
        return response_with(FORBIDDEN_403)
    if not (session["role"] == 'administrator'):
        return response_with(FORBIDDEN_403)
    files = []
    for f in glob.glob("db_backup/*.sql"):
        files.append(f[10:-4])
    print(files)
    return response_with(resp.SUCCESS_200, value={"query": files})
docs.register(backup_names)
'''