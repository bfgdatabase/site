from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from schemas import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc

@app.route('/api/tnotchs/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all tnotchs', tags=['tnotchs'])
@resp.check_user_permission(dbName = "TnotchDB", method = 'GET')
def get_tnotchs():
    query = TnotchDB.query.all()
    query_schema = TnotchSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_tnotchs)

@app.route('/api/tnotch/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get tnotch by id', tags=['tnotchs'])
@marshal_with(TnotchSchema())
@resp.check_user_permission(dbName = "TnotchDB", method = 'GET')
def get_tnotch(id):
    query = TnotchDB.query.get_or_404(id)
    query_schema = TnotchSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_tnotch)

@app.route('/api/tnotchs/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find tnotchs with params', tags=['tnotchs'])
@marshal_with(TnotchSchema(many=True))
@use_kwargs(TnotchSchema(exclude=("tnotch_id",)))
@resp.check_user_permission(dbName = "TnotchDB", method = 'GET')
def find_tnotchs(**kwargs):
    query = TnotchDB.query.filter_by(**kwargs).all()
    query_schema = TnotchSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(find_tnotchs)

@app.route('/api/tnotch/', methods=['POST'], provide_automatic_options=False)
@doc(description='Create tnotch', tags=['tnotchs'])
@marshal_with(TnotchSchema)
@use_kwargs(TnotchSchema(exclude=("tnotch_id",)))
@resp.check_user_permission(dbName = "TnotchDB", method = 'PUT')
def create_tnotchs(**kwargs):  
    query = TnotchDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    query.created = datetime.now(timezone.utc)
    db.session.add(query)
    db.session.commit()
    schema = TnotchSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_tnotchs)

@app.route('/api/tnotch/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update tnotch by id', tags=['tnotchs'])
@marshal_with(TnotchSchema)
@use_kwargs(TnotchSchema(exclude=("tnotch_id",)))
@resp.check_user_permission(dbName = "TnotchDB", method = 'PUT')
def update_tnotchs(id, **kwargs):  
    query = TnotchDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = TnotchSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_tnotchs)

@app.route('/api/tnotch/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete tnotch by id', tags=['tnotchs'])
@resp.check_user_permission(dbName = "TnotchDB", method = 'DELETE')
def delete_tnotchs(id):
    query = TnotchDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_tnotchs)





