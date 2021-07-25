from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from schemas import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc

@app.route('/api/batchpauses/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all batchpauses', tags=['batchpause'])
@resp.check_user_permission(dbName = "BatchpauseDB", method = 'GET')
def get_batchpauses():
    query = BatchpauseDB.query.all()
    query_schema = BatchpauseSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_batchpauses)

@app.route('/api/batchpause/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get batchpause by id', tags=['batchpause'])
@resp.check_user_permission(dbName = "BatchpauseDB", method = 'GET')
@marshal_with(BatchpauseSchema())
def get_batchpause(id):
    query = BatchpauseDB.query.get_or_404(id)
    query_schema = BatchpauseSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_batchpause)

@app.route('/api/batchpausees/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find batchpause with params', tags=['batchpause'])
@marshal_with(BatchpauseSchema(many=True))
@use_kwargs(BatchpauseSchema(exclude=("batchpause_id",)))
@resp.check_user_permission(dbName = "BatchpauseDB", method = 'GET')
def find_batchpause(**kwargs):
    query = BatchpauseDB.query.filter_by(**kwargs).all()
    query_schema = BatchpauseSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(find_batchpause)
