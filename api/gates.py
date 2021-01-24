from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc

@app.route('/api/gates/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all gates', tags=['gates'])
@resp.check_user_permission(dbName = "GatesDB", method = 'GET')
def get_gates():
    query = GatesDB.query.all()
    query_schema = GatesSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_gates)

@app.route('/api/gates/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find gates with params', tags=['gates'])
@marshal_with(GatesSchema(many=True))
@use_kwargs(GatesSchema(exclude=("id_gate",)))
@resp.check_user_permission(dbName = "GatesDB", method = 'GET')
def find_gates(**kwargs):
    query = GatesDB.query.filter_by(**kwargs).all()
    query_schema = GatesSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(find_gates)

@app.route('/api/gates/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update gate by id', tags=['gates'])
@marshal_with(GatesSchema)
@use_kwargs(GatesSchema(exclude=("id_gate",)))
@resp.check_user_permission(dbName = "GatesDB", method = 'PUT')
def update_gate(id, **kwargs):  
    query = GatesDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = GatesSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_gate)


