from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc

@app.route('/api/enterprise', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all enterprise', tags=['enterprise'])
@resp.check_user_permission(dbName = "EnterpriseDB", method = 'GET')
def get_enterprise():
    query = EnterpriseDB.query.all()
    query_schema = EnterpriseSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_enterprise)

@app.route('/api/enterprise', methods=['POST'], provide_automatic_options=False)
@doc(description='Create enterprise', tags=['enterprise'])
@marshal_with(EnterpriseSchema)
@use_kwargs(EnterpriseSchema(exclude=("id",)))
@resp.check_user_permission(dbName = "EnterpriseDB", method = 'PUT')
def create_enterprise(**kwargs):  
    query = EnterpriseDB.query()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()
    schema = EnterpriseSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_enterprise)

@app.route('/api/enterprise/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update enterprise by id', tags=['enterprise'])
@resp.check_user_permission(dbName = "EnterpriseDB", method = 'PUT')
@marshal_with(EnterpriseSchema)
@use_kwargs(EnterpriseSchema)
def update_enterprise(**kwargs):  
    query = EnterpriseDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = EnterpriseSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_enterprise)

@app.route('/api/enterprise/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete enterprise by id', tags=['enterprise'])
@resp.check_user_permission(dbName = "EnterpriseDB", method = 'DELETE')
def delete_enterprise(id):
    query = EnterpriseDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_enterprise)






