from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc

@app.route('/api/specifications/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all specifications', tags=['specifications'])
@resp.check_user_permission(dbName = "SpecDB", method = 'GET')
def get_specifications():
    query = SpecDB.query.all()
    query_schema = SpecSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_specifications)

@app.route('/api/specifications/', methods=['POST'], provide_automatic_options=False)
@doc(description='Create specification', tags=['specifications'])
@marshal_with(SpecSchema)
@use_kwargs(SpecSchema(exclude=("id_spec",)))
@resp.check_user_permission(dbName = "SpecDB", method = 'PUT')
def create_specifications(**kwargs):  
    query = SpecDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()
    schema = SpecSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_specifications)

@app.route('/api/specification/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find specifications with params', tags=['specifications'])
@marshal_with(SpecSchema(many=True))
@use_kwargs(SpecSchema(exclude=("id_spec",)))
@resp.check_user_permission(dbName = "SpecDB", method = 'GET')
def find_specifications(**kwargs):
    query = SpecDB.query.filter_by(**kwargs).all()
    query_schema = SpecSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(find_specifications)

@app.route('/api/specifications/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update specification by id', tags=['specifications'])
@marshal_with(SpecSchema)
@use_kwargs(SpecSchema(exclude=("id_spec",)))
@resp.check_user_permission(dbName = "SpecDB", method = 'PUT')
def update_specifications(id, **kwargs):  
    query = SpecDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = SpecSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_specifications)

@app.route('/api/specifications/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete specifications by id', tags=['specifications'])
@resp.check_user_permission(dbName = "SpecDB", method = 'DELETE')
def delete_specifications(id):
    query = SpecDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_specifications)

@app.route('/api/specification/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get specification by id', tags=['specifications'])
@marshal_with(SpecSchema())
@resp.check_user_permission(dbName = "SpecDB", method = 'GET')
def get_specification(id):
    query = SpecDB.query.get_or_404(id)
    query_schema = SpecSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_specification)






