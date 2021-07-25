from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from schemas import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc

@app.route('/api/tmetrics/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all tmetrics', tags=['tmetrics'])
@resp.check_user_permission(dbName = "TmetricDB", method = 'GET')
def get_tmetrics():
    query = TmetricDB.query.all()
    query_schema = TmetricSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_tmetrics)

@app.route('/api/tmetric/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get tmetric by id', tags=['tmetrics'])
@marshal_with(TmetricSchema())
@resp.check_user_permission(dbName = "TmetricDB", method = 'GET')
def get_tmetric(id):
    query = TmetricDB.query.get_or_404(id)
    query_schema = TmetricSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_tmetric)

@app.route('/api/tmetrics/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find tmetrics with params', tags=['tmetrics'])
@marshal_with(TmetricSchema(many=True))
@use_kwargs(TmetricSchema(exclude=("tmetric_id",)))
@resp.check_user_permission(dbName = "TmetricDB", method = 'GET')
def find_tmetrics(**kwargs):
    query = TmetricDB.query.filter_by(**kwargs).all()
    query_schema = TmetricSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(find_tmetrics)

@app.route('/api/tmetric/', methods=['POST'], provide_automatic_options=False)
@doc(description='Create tmetric', tags=['tmetrics'])
@marshal_with(TmetricSchema)
@use_kwargs(TmetricSchema(exclude=("tmetric_id",)))
@resp.check_user_permission(dbName = "TmetricDB", method = 'PUT')
def create_tmetrics(**kwargs):  
    query = TmetricDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    query.created = datetime.now(timezone.utc)
    db.session.add(query)
    db.session.commit()
    schema = TmetricSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_tmetrics)

@app.route('/api/tmetric/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update tmetric by id', tags=['tmetrics'])
@marshal_with(TmetricSchema)
@use_kwargs(TmetricSchema(exclude=("tmetric_id",)))
@resp.check_user_permission(dbName = "TmetricDB", method = 'PUT')
def update_tmetrics(id, **kwargs):  
    query = TmetricDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = TmetricSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_tmetrics)

@app.route('/api/tmetric/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete tmetric by id', tags=['tmetrics'])
@resp.check_user_permission(dbName = "TmetricDB", method = 'DELETE')
def delete_tmetrics(id):
    query = TmetricDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_tmetrics)





