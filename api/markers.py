from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc

@app.route('/api/markers', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all markers', tags=['markers'])
@resp.check_user_permission(dbName = "MarksDB", method = 'GET')
def get_markers():
    query = MarksDB.query.all()
    query_schema = MarksSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_markers)

@app.route('/api/markers', methods=['POST'], provide_automatic_options=False)
@doc(description='Create marker', tags=['markers'])
@marshal_with(MarksSchema)
@use_kwargs(MarksSchema(exclude=("id_mark",)))
@resp.check_user_permission(dbName = "MarksDB", method = 'PUT')
def create_markers(**kwargs):  
    query = MarksDB.query()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()
    schema = MarksSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_markers)

@app.route('/api/markers/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update marker by id', tags=['markers'])
@resp.check_user_permission(dbName = "MarksDB", method = 'PUT')
@marshal_with(MarksSchema)
@use_kwargs(MarksSchema)
def update_markers(**kwargs):  
    query = MarksDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = MarksSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_markers)

@app.route('/api/markers/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete markers by id', tags=['markers'])
@resp.check_user_permission(dbName = "MarksDB", method = 'DELETE')
def delete_markers(id):
    query = MarksDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_markers)






