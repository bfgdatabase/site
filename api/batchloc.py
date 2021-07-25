from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from schemas import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc


@app.route('/api/batchloc/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all batchlocs', tags=['batchloc'])
@resp.check_user_permission(dbName = "BatchlocDB", method = 'GET')
def get_batchlocs():
    query = BatchlocDB.query.all()
    query_schema = BatchlocSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_batchlocs)

@app.route('/api/batchloc/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get batchloc by id', tags=['batchloc'])
@resp.check_user_permission(dbName = "BatchlocDB", method = 'GET')
@marshal_with(BatchlocSchema())
def get_batchloc(id):
    query = BatchlocDB.query.get_or_404(id)
    query_schema = BatchlocSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_batchloc)

@app.route('/api/batchlocs/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find batchloc with params', tags=['batchloc'])
@marshal_with(BatchlocSchema(many=True))
@use_kwargs(BatchlocSchema(exclude=("batchloc_id",)))
@resp.check_user_permission(dbName = "BatchlocDB", method = 'GET')
def find_batchloc(**kwargs):
    query = BatchlocDB.query.filter_by(**kwargs).all()
    query_schema = BatchlocSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(find_batchloc)
