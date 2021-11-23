from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from schemas import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc


@app.route('/api/errors/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all errors', tags=['error'])
@resp.check_user_permission(dbName = "ErrorDB", method = 'GET')
def get_errors():
    query = ErrorDB.query.all()
    query_schema = ErrorSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_errors)

@app.route('/api/error/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get error by id', tags=['error'])
@resp.check_user_permission(dbName = "ErrorDB", method = 'GET')
@marshal_with(ErrorSchema())
def get_error(id):
    query = ErrorDB.query.get_or_404(id)
    query_schema = ErrorSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_error)

@app.route('/api/errors/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find error with params', tags=['error'])
@marshal_with(ErrorSchema(many=True))
@use_kwargs(ErrorSchema(exclude=("error_id",)))
@resp.check_user_permission(dbName = "ErrorDB", method = 'GET')
def find_error(**kwargs):
    query = ErrorDB.query.filter_by(**kwargs).all()
    query_schema = ErrorSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(find_error)


@app.route('/api/error_time/<begin>/<end>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get error by id and time (time format 2020-08-28 13:17:10.171395)', tags=['error'])
@resp.check_user_permission(dbName = "ErrorDB", method = 'GET')
@marshal_with(ErrorSchema())
def get_error_time(id, begin, end):
    begin = begin.replace("T", " ").replace(".000Z", "")
    end = end.replace("T", " ").replace(".000Z", "")
    query = ErrorDB.query.filter(ErrorDB.create_time.between(begin, end)).order_by("create_time").all()
    query_schema = MarklogSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_error_time)