from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc

@app.route('/api/technologies/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all technologies', tags=['technologies'])
@resp.check_user_permission(dbName = "TechDB", method = 'GET')
def get_technologies():
    query = TechDB.query.all()
    query_schema = TechSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_technologies)

@app.route('/api/technology/', methods=['POST'], provide_automatic_options=False)
@doc(description='Create technology', tags=['technologies'])
@marshal_with(TechSchema)
@use_kwargs(TechSchema(exclude=("id_techop",)))
@resp.check_user_permission(dbName = "TechDB", method = 'PUT')
def create_technology(**kwargs):  
    query = TechDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()
    schema = TechSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_technology)

@app.route('/api/technologies/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find technologies with params', tags=['technologies'])
@marshal_with(TechSchema(many=True))
@use_kwargs(TechSchema(exclude=("id_techop",)))
@resp.check_user_permission(dbName = "TechDB", method = 'GET')
def find_technologies(**kwargs):
    query = TechDB.query.filter_by(**kwargs).all()
    query_schema = TechSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(find_technologies)

@app.route('/api/technologies/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update technology by id', tags=['technologies'])
@marshal_with(TechSchema)
@use_kwargs(TechSchema(exclude=("id_techop",)))
@resp.check_user_permission(dbName = "TechDB", method = 'PUT')
def update_technology(id, **kwargs):  
    query = TechDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = TechSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_technology)

@app.route('/api/technologies/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete technologies by id', tags=['technologies'])
@resp.check_user_permission(dbName = "TechDB", method = 'DELETE')
def delete_technology(id):
    query = TechDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_technology)

@app.route('/api/technology/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get technology by id', tags=['technologies'])
@marshal_with(TechSchema())
@resp.check_user_permission(dbName = "TechDB", method = 'GET')
def get_technology(id):
    query = TechDB.query.get_or_404(id)
    query_schema = TechSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_technology)




