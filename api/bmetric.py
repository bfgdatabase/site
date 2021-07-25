from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from schemas import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc


@app.route('/api/bmetric/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all bmetrics', tags=['bmetric'])
@resp.check_user_permission(dbName = "BmetricDB", method = 'GET')
def get_bmetrics():
    query = BmetricDB.query.all()
    query_schema = BmetricSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_bmetrics)

@app.route('/api/bmetric/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get bmetric by id', tags=['bmetric'])
@resp.check_user_permission(dbName = "BmetricDB", method = 'GET')
@marshal_with(BmetricSchema())
def get_bmetric(id):
    query = BmetricDB.query.get_or_404(id)
    query_schema = BmetricSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_bmetric)

@app.route('/api/bmetric/', methods=['POST'], provide_automatic_options=False)
@doc(description='Create bmetric', tags=['bmetric'])
@marshal_with(BmetricSchema)
@use_kwargs(BmetricSchema(exclude=("bmetric_id",)))
@resp.check_user_permission(dbName = "BmetricDB", method = 'PUT')
def create_bmetric(**kwargs):  
    query = BmetricDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()   
    schema = BmetricSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_bmetric)

@app.route('/api/bmetrics/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find bmetric with params', tags=['bmetric'])
@marshal_with(BmetricSchema(many=True))
@use_kwargs(BmetricSchema(exclude=("bmetric_id",)))
@resp.check_user_permission(dbName = "BmetricDB", method = 'GET')
def find_bmetric(**kwargs):
    query = BmetricDB.query.filter_by(**kwargs).all()
    query_schema = BmetricSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(find_bmetric)

@app.route('/api/bmetric/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update bmetric by id', tags=['bmetric'])
@marshal_with(BmetricSchema)
@use_kwargs(BmetricSchema(exclude=("bmetric_id",)))
@resp.check_user_permission(dbName = "BmetricDB", method = 'PUT')
def update_bmetric(id, **kwargs):  
    query = BmetricDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = BmetricSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_bmetric)

@app.route('/api/bmetric/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete bmetric by id', tags=['bmetric'])
@resp.check_user_permission(dbName = "BmetricDB", method = 'DELETE')
def delete_bmetric(id):
    query = BmetricDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_bmetric)
