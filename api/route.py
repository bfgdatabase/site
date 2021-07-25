from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from schemas import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc


@app.route('/api/route/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all routes', tags=['route'])
@resp.check_user_permission(dbName = "RouteDB", method = 'GET')
def get_routes():
    query = RouteDB.query.all()
    query_schema = RouteSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_routes)

@app.route('/api/route/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get route by id', tags=['route'])
@resp.check_user_permission(dbName = "RouteDB", method = 'GET')
@marshal_with(RouteSchema())
def get_route(id):
    query = RouteDB.query.get_or_404(id)
    query_schema = RouteSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_route)

@app.route('/api/route/', methods=['POST'], provide_automatic_options=False)
@doc(description='Create route', tags=['route'])
@marshal_with(RouteSchema)
@use_kwargs(RouteSchema(exclude=("route_id",)))
@resp.check_user_permission(dbName = "RouteDB", method = 'PUT')
def create_route(**kwargs):  
    query = RouteDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()   
    schema = RouteSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_route)

@app.route('/api/routes/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find route with params', tags=['route'])
@marshal_with(RouteSchema(many=True))
@use_kwargs(RouteSchema(exclude=("route_id",)))
@resp.check_user_permission(dbName = "RouteDB", method = 'GET')
def find_route(**kwargs):
    query = RouteDB.query.filter_by(**kwargs).all()
    query_schema = RouteSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(find_route)

@app.route('/api/route/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update route by id', tags=['route'])
@marshal_with(RouteSchema)
@use_kwargs(RouteSchema(exclude=("route_id",)))
@resp.check_user_permission(dbName = "RouteDB", method = 'PUT')
def update_route(id, **kwargs):  
    query = RouteDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = RouteSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_route)

@app.route('/api/route/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete route by id', tags=['route'])
@resp.check_user_permission(dbName = "RouteDB", method = 'DELETE')
def delete_route(id):
    query = RouteDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_route)
