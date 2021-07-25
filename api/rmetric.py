from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from schemas import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc


@app.route('/api/rmetric/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all rmetrics', tags=['rmetric'])
@resp.check_user_permission(dbName = "RmetricDB", method = 'GET')
def get_rmetrics():
    query = RmetricDB.query.all()
    query_schema = RmetricSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_rmetrics)

@app.route('/api/rmetric/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get rmetric by id', tags=['rmetric'])
@resp.check_user_permission(dbName = "RmetricDB", method = 'GET')
@marshal_with(RmetricSchema())
def get_rmetric(id):
    query = RmetricDB.query.get_or_404(id)
    query_schema = RmetricSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_rmetric)

@app.route('/api/rmetric/', methods=['POST'], provide_automatic_options=False)
@doc(description='Create rmetric', tags=['rmetric'])
@marshal_with(RmetricSchema)
@use_kwargs(RmetricSchema(exclude=("rmetric_id",)))
@resp.check_user_permission(dbName = "RmetricDB", method = 'PUT')
def create_rmetric(**kwargs):  
    query = RmetricDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()   
    schema = RmetricSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_rmetric)

@app.route('/api/rmetrics/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find rmetric with params', tags=['rmetric'])
@marshal_with(RmetricSchema(many=True))
@use_kwargs(RmetricSchema(exclude=("rmetric_id",)))
@resp.check_user_permission(dbName = "RmetricDB", method = 'GET')
def find_rmetric(**kwargs):
    query = RmetricDB.query.filter_by(**kwargs).all()
    query_schema = RmetricSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(find_rmetric)

@app.route('/api/rmetric/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update rmetric by id', tags=['rmetric'])
@marshal_with(RmetricSchema)
@use_kwargs(RmetricSchema(exclude=("rmetric_id",)))
@resp.check_user_permission(dbName = "RmetricDB", method = 'PUT')
def update_rmetric(id, **kwargs):  
    query = RmetricDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = RmetricSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_rmetric)

@app.route('/api/rmetric/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete rmetric by id', tags=['rmetric'])
@resp.check_user_permission(dbName = "RmetricDB", method = 'DELETE')
def delete_rmetric(id):
    query = RmetricDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_rmetric)
