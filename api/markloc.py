from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from schemas import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc


@app.route('/api/markloc/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all marklocs', tags=['markloc'])
@resp.check_user_permission(dbName = "MarklocDB", method = 'GET')
def get_marklocs():
    query = MarklocDB.query.all()
    query_schema = MarklocSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_marklocs)

@app.route('/api/markloc/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get markloc by id', tags=['markloc'])
@resp.check_user_permission(dbName = "MarklocDB", method = 'GET')
@marshal_with(MarklocSchema())
def get_markloc(id):
    query = MarklocDB.query.get_or_404(id)
    query_schema = MarklocSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_markloc)

@app.route('/api/marklocs/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find markloc with params', tags=['markloc'])
@marshal_with(MarklocSchema(many=True))
@use_kwargs(MarklocSchema(exclude=("markloc_id",)))
@resp.check_user_permission(dbName = "MarklocDB", method = 'GET')
def find_markloc(**kwargs):
    query = MarklocDB.query.filter_by(**kwargs).all()
    query_schema = MarklocSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(find_markloc)
