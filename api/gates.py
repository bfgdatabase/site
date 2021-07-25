from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from schemas import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc

@app.route('/api/gates/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all gates', tags=['gate'])
@resp.check_user_permission(dbName = "GatesDB", method = 'GET')
def get_gates():
    query = GatesDB.query.all()
    query_schema = GatesSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_gates)

@app.route('/api/gate/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get gate by id', tags=['gate'])
@marshal_with(GatesSchema())
@resp.check_user_permission(dbName = "GatesDB", method = 'GET')
def get_gate(id):
    query = GatesDB.query.get_or_404(id)
    query_schema = GatesSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_gate)

@app.route('/api/gate/', methods=['POST'], provide_automatic_options=False)
@doc(description='Create gate', tags=['gate'])
@marshal_with(GatesSchema)
@use_kwargs(GatesSchema(exclude=("gate_id",)))
@resp.check_user_permission(dbName = "GatesDB", method = 'PUT')
def create_gate(**kwargs):  
    query = GatesDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()
    schema = GatesSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_gate)

@app.route('/api/gates/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find gate with params', tags=['gate'])
@marshal_with(GatesSchema(many=True))
@use_kwargs(GatesSchema(exclude=("gate_id",)))
@resp.check_user_permission(dbName = "GatesDB", method = 'GET')
def find_gate(**kwargs):
    query = GatesDB.query.filter_by(**kwargs).all()
    query_schema = GatesSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(find_gate)

@app.route('/api/gate/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update gate by id', tags=['gate'])
@marshal_with(GatesSchema)
@use_kwargs(GatesSchema(exclude=("gate_id",)))
@resp.check_user_permission(dbName = "GatesDB", method = 'PUT')
def update_gate(id, **kwargs):  
    query = GatesDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = GatesSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_gate)

@app.route('/api/gate/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete gate by id', tags=['gate'])
@resp.check_user_permission(dbName = "GatesDB", method = 'DELETE')
def delete_gate(id):
    query = GatesDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_gate)
