from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from schemas import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc

@app.route('/api/telecodes/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all telecodes', tags=['telecodes'])
@resp.check_user_permission(dbName = "TelecodeDB", method = 'GET')
def get_telecodes():
    query = TelecodeDB.query.all()
    query_schema = TelecodeSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_telecodes)

@app.route('/api/telecode/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get telecode by id', tags=['telecodes'])
@marshal_with(TelecodeSchema())
@resp.check_user_permission(dbName = "TelecodeDB", method = 'GET')
def get_telecode(id):
    query = TelecodeDB.query.get_or_404(id)
    query_schema = TelecodeSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_telecode)

@app.route('/api/telecodes/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find telecodes with params', tags=['telecodes'])
@marshal_with(TelecodeSchema(many=True))
@use_kwargs(TelecodeSchema(exclude=("telecode_id",)))
@resp.check_user_permission(dbName = "TelecodeDB", method = 'GET')
def find_telecodes(**kwargs):
    query = TelecodeDB.query.filter_by(**kwargs).all()
    query_schema = TelecodeSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(find_telecodes)

@app.route('/api/telecode/', methods=['POST'], provide_automatic_options=False)
@doc(description='Create telecode', tags=['telecodes'])
@marshal_with(TelecodeSchema)
@use_kwargs(TelecodeSchema(exclude=("telecode_id",)))
@resp.check_user_permission(dbName = "TelecodeDB", method = 'PUT')
def create_telecodes(**kwargs):  
    query = TelecodeDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    query.created = datetime.now(timezone.utc)
    db.session.add(query)
    db.session.commit()
    schema = TelecodeSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_telecodes)

@app.route('/api/telecode/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update telecode by id', tags=['telecodes'])
@marshal_with(TelecodeSchema)
@use_kwargs(TelecodeSchema(exclude=("telecode_id",)))
@resp.check_user_permission(dbName = "TelecodeDB", method = 'PUT')
def update_telecodes(id, **kwargs):  
    query = TelecodeDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = TelecodeSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_telecodes)

@app.route('/api/telecode/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete telecode by id', tags=['telecodes'])
@resp.check_user_permission(dbName = "TelecodeDB", method = 'DELETE')
def delete_telecodes(id):
    query = TelecodeDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_telecodes)





