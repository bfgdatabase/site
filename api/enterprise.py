from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc

@app.route('/api/enterprises/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all enterprises', tags=['enterprise'])
@resp.check_user_permission(dbName = "EnterpriseDB", method = 'GET')
def enterprises():
    query = EnterpriseDB.query.all()
    query_schema = EnterpriseSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(enterprises)

@app.route('/api/enterprise/', methods=['POST'], provide_automatic_options=False)
@doc(description='Create enterprise', tags=['enterprise'])
@marshal_with(EnterpriseSchema)
@use_kwargs(EnterpriseSchema(exclude=("id",)))
@resp.check_user_permission(dbName = "EnterpriseDB", method = 'PUT')
def create_enterprise(**kwargs):  
    query = EnterpriseDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()
    schema = EnterpriseSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_enterprise)

@app.route('/api/enterprises/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find enterprise with params', tags=['enterprise'])
@marshal_with(EnterpriseSchema(many=True))
@use_kwargs(EnterpriseSchema(exclude=("id",)))
@resp.check_user_permission(dbName = "EnterpriseDB", method = 'GET')
def find_enterprise(**kwargs):
    query = EnterpriseDB.query.filter_by(**kwargs).all()
    query_schema = EnterpriseSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(find_enterprise)

@app.route('/api/enterprise/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update enterprise by id', tags=['enterprise'])
@marshal_with(EnterpriseSchema)
@use_kwargs(EnterpriseSchema(exclude=("id",)))
@resp.check_user_permission(dbName = "EnterpriseDB", method = 'PUT')
def update_enterprise(id, **kwargs):  
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
    query = DepartmentDB.query.filter_by(ent_id = id).all()
    for item in query:
        l_query = LocationsDB.query.filter_by(dept_id = item.dept_id).all()
        for l_item in l_query:
            db.session.delete(l_item)
            db.session.commit() 
        db.session.delete(item)
        db.session.commit() 
    query = EnterpriseDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_enterprise)

@app.route('/api/enterprise/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get enterprise by id', tags=['enterprise'])
@marshal_with(EnterpriseSchema())
@resp.check_user_permission(dbName = "EnterpriseDB", method = 'GET')
def get_enterprise(id):
    query = EnterpriseDB.query.get_or_404(id)
    query_schema = EnterpriseSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_enterprise)




