from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from schemas import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc

@app.route('/api/tags/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all tags', tags=['tag'])
@resp.check_user_permission(dbName = "TagsDB", method = 'GET')
def get_tags():
    query = TagsDB.query.all()
    query_schema = TagsSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_tags)

@app.route('/api/tag/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get tag by id', tags=['tag'])
@marshal_with(TagsSchema())
@resp.check_user_permission(dbName = "TagsDB", method = 'GET')
def get_tag(id):
    query = TagsDB.query.get_or_404(id)
    query_schema = TagsSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_tag)

@app.route('/api/tag/', methods=['POST'], provide_automatic_options=False)
@doc(description='Create tag', tags=['tag'])
@marshal_with(TagsSchema)
@use_kwargs(TagsSchema(exclude=("tag_id",)))
@resp.check_user_permission(dbName = "TagsDB", method = 'PUT')
def create_tag(**kwargs):  
    query = TagsDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()
    schema = TagsSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_tag)

@app.route('/api/tags/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find tag with params', tags=['tag'])
@marshal_with(TagsSchema(many=True))
@use_kwargs(TagsSchema(exclude=("tag_id",)))
@resp.check_user_permission(dbName = "TagsDB", method = 'GET')
def find_tag(**kwargs):
    query = TagsDB.query.filter_by(**kwargs).all()
    query_schema = TagsSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(find_tag)

@app.route('/api/tag/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update tag by id', tags=['tag'])
@marshal_with(TagsSchema)
@use_kwargs(TagsSchema(exclude=("tag_id",)))
@resp.check_user_permission(dbName = "TagsDB", method = 'PUT')
def update_tag(id, **kwargs):  
    query = TagsDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = TagsSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_tag)

@app.route('/api/tag/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete tag by id', tags=['tag'])
@resp.check_user_permission(dbName = "TagsDB", method = 'DELETE')
def delete_tag(id):
    query = TagsDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_tag)