from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc


@app.route('/api/tags', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all tags', tags=['tags'])
@resp.check_user_permission(dbName = "TagsDB", method = 'GET')
def get_tags():
    query = TagsDB.query.all()
    query_schema = TagsSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_tags)

@app.route('/api/tags/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update tag by id', tags=['tags'])
@marshal_with(TagsSchema)
@use_kwargs(TagsSchema(exclude=("id_tag",)))
@resp.check_user_permission(dbName = "TagsDB", method = 'PUT')
def update_tag(**kwargs):  
    query = TagsDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = TagsSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_tag)
