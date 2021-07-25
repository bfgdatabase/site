from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from schemas import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc

@app.route('/api/setnotchs/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all setnotchs', tags=['setnotchs'])
@resp.check_user_permission(dbName = "SetnotchDB", method = 'GET')
def get_setnotchs():
    query = SetnotchDB.query.all()
    query_schema = SetnotchSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_setnotchs)

@app.route('/api/setnotch/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get setnotch by id', tags=['setnotchs'])
@marshal_with(SetnotchSchema())
@resp.check_user_permission(dbName = "SetnotchDB", method = 'GET')
def get_setnotch(id):
    query = SetnotchDB.query.get_or_404(id)
    query_schema = SetnotchSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_setnotch)

@app.route('/api/setnotchs/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find setnotchs with params', tags=['setnotchs'])
@marshal_with(SetnotchSchema(many=True))
@use_kwargs(SetnotchSchema(exclude=("setnotch_id",)))
@resp.check_user_permission(dbName = "SetnotchDB", method = 'GET')
def find_setnotchs(**kwargs):
    query = SetnotchDB.query.filter_by(**kwargs).all()
    query_schema = SetnotchSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(find_setnotchs)

@app.route('/api/setnotch/', methods=['POST'], provide_automatic_options=False)
@doc(description='Create setnotch', tags=['setnotchs'])
@marshal_with(SetnotchSchema)
@use_kwargs(SetnotchSchema(exclude=("setnotch_id",)))
@resp.check_user_permission(dbName = "SetnotchDB", method = 'PUT')
def create_setnotchs(**kwargs):  
    query = SetnotchDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    query.created = datetime.now(timezone.utc)
    db.session.add(query)
    db.session.commit()
    schema = SetnotchSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_setnotchs)

@app.route('/api/setnotch/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update setnotch by id', tags=['setnotchs'])
@marshal_with(SetnotchSchema)
@use_kwargs(SetnotchSchema(exclude=("setnotch_id",)))
@resp.check_user_permission(dbName = "SetnotchDB", method = 'PUT')
def update_setnotchs(id, **kwargs):  
    query = SetnotchDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = SetnotchSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_setnotchs)

@app.route('/api/setnotch/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete setnotch by id', tags=['setnotchs'])
@resp.check_user_permission(dbName = "SetnotchDB", method = 'DELETE')
def delete_setnotchs(id):
    query = SetnotchDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_setnotchs)





