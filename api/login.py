import os
from app import *
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from schemas import *
from flask_sqlalchemy import SQLAlchemy
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc
from flask_bcrypt import Bcrypt

@app.route('/api/login', methods = ['POST'], provide_automatic_options=False)
@doc(description='User login', tags=['login'])
@use_kwargs(UsersSchema(only=("login", "password_hash",)))
def login(**kwargs):
    query = UsersDB.authentificate(login = kwargs['login'] ,password =  kwargs['password_hash'])
    if(not query):
        return response_with(resp.UNAUTHORIZED_401)
    session["username"] = query.username
    session["login"] = query.login
    session["role"] = query.role
    return response_with(resp.SUCCESS_200)
docs.register(login)


@app.route('/api/logout', provide_automatic_options=False)
@doc(description='User logout', tags=['login'])
def logout():
    session.pop("username", None)
    session.pop("login", None)
    session.pop("role", None)
    return response_with(resp.SUCCESS_200)
docs.register(logout)