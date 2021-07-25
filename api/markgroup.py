from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from schemas import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc

@app.route('/api/markgroups/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all markgroups', tags=['sensors'])
@resp.check_user_permission(dbName = "MarkGroupDB", method = 'GET')
def get_markgroups():
    query = MarkGroupDB.query.all()
    query_schema = MarkGroupSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_markgroups)

@app.route('/api/markgroup/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete markgroup by id', tags=['sensors'])
@resp.check_user_permission(dbName = "MarkGroupDB", method = 'DELETE')
def delete_markgroup(id):
    query = MarkGroupDB.query.get_or_404(id)    
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_markgroup)

@app.route('/api/markgroup/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get markgroup by id', tags=['sensors'])
@use_kwargs(MarkGroupSchema(exclude=("markgroup_id",)))
@resp.check_user_permission(dbName = "MarkGroupDB", method = 'GET')
def get_markgroup(id):
    query = MarkGroupDB.query.get_or_404(id)
    query_schema = MarkGroupSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_markgroup)

@app.route('/api/markgroups/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find markgroup with params', tags=['sensors'])
@marshal_with(MarkGroupSchema(many=True))
@use_kwargs(MarkGroupSchema(exclude=("markgroup_id",)))
@resp.check_user_permission(dbName = "MarkGroupDB", method = 'GET')
def get_markgroup_filter(**kwargs):
    query = MarkGroupDB.query.filter_by(**kwargs).all()
    query_schema = MarkGroupSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_markgroup_filter)

@app.route('/api/markgroup/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update markgroup by id', tags=['sensors'])
@marshal_with(MarkGroupSchema)
@use_kwargs(MarkGroupSchema(exclude=("markgroup_id",)))
@resp.check_user_permission(dbName = "MarkGroupDB", method = 'PUT')
def update_markgroup(id, **kwargs):  
    query = MarkGroupDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = MarkGroupSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_markgroup)

@app.route('/api/markgroup', methods=['POST'], provide_automatic_options=False)
@doc(description='Create markgroup', tags=['sensors'])
@marshal_with(MarkGroupSchema)
@use_kwargs(MarkGroupSchema(exclude=("markgroup_id",)))
@resp.check_user_permission(dbName = "MarkGroupDB", method = 'PUT')
def create_markgroup(**kwargs):  
    query = MarkGroupDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()
    schema = MarkGroupSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_markgroup)



