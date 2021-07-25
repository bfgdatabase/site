from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from schemas import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc


@app.route('/api/notch/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all notchs', tags=['notch'])
@resp.check_user_permission(dbName = "NotchDB", method = 'GET')
def get_notchs():
    query = NotchDB.query.all()
    query_schema = NotchSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_notchs)

@app.route('/api/notch/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get notch by id', tags=['notch'])
@resp.check_user_permission(dbName = "NotchDB", method = 'GET')
@marshal_with(NotchSchema())
def get_notch(id):
    query = NotchDB.query.get_or_404(id)
    query_schema = NotchSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_notch)
