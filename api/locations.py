from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc

@app.route('/api/locations/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all locations', tags=['locations'])
@resp.check_user_permission(dbName = "LocationsDB", method = 'GET')
def get_locations():
    query = LocationsDB.query.all()
    query_schema = LocationsSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_locations)

@app.route('/api/location/', methods=['POST'], provide_automatic_options=False)
@doc(description='Create location', tags=['locations'])
@marshal_with(LocationsSchema)
@use_kwargs(LocationsSchema(exclude=("dept_id",)))
@resp.check_user_permission(dbName = "LocationsDB", method = 'PUT')
def create_location(**kwargs):  
    query = LocationsDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()
    schema = LocationsSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_location)

@app.route('/api/locations/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find gates with params', tags=['locations'])
@marshal_with(LocationsSchema(many=True))
@use_kwargs(LocationsSchema(exclude=("dept_id",)))
@resp.check_user_permission(dbName = "LocationsDB", method = 'GET')
def find_locations(**kwargs):
    query = LocationsDB.query.filter_by(**kwargs).all()
    query_schema = LocationsSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(find_locations)

@app.route('/api/locations/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update location by id', tags=['locations'])
@marshal_with(LocationsSchema)
@use_kwargs(LocationsSchema(exclude=("dept_id",)))
@resp.check_user_permission(dbName = "LocationsDB", method = 'PUT')
def update_location(id, **kwargs):  
    query = LocationsDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = LocationsSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_location)

@app.route('/api/locations/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete location by id', tags=['locations'])
@resp.check_user_permission(dbName = "LocationsDB", method = 'DELETE')
def delete_location(id):
    query = LocationsDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_location)

@app.route('/api/locations/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get location by id', tags=['locations'])
@marshal_with(LocationsSchema())
@resp.check_user_permission(dbName = "LocationsDB", method = 'GET')
def get_location(id):
    query = LocationsDB.query.get_or_404(id)
    query_schema = LocationsSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_location)



