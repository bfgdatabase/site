from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc

@app.route('/api/zones/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all zones', tags=['zone'])
@resp.check_user_permission(dbName = "ZonesDB", method = 'GET')
def get_zones():
    query = ZonesDB.query.all()
    query_schema = ZonesSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_zones)

@app.route('/api/zone/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete zone by id', tags=['zone'])
@resp.check_user_permission(dbName = "ZonesDB", method = 'DELETE')
def delete_zone(id):
    query = ZonesDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_zone)

@app.route('/api/zone/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get zone by id', tags=['zone'])
@use_kwargs(ZonesSchema(exclude=("id_zone",)))
@resp.check_user_permission(dbName = "ZonesDB", method = 'GET')
def get_zone(id):
    query = ZonesDB.query.get_or_404(id)
    query_schema = ZonesSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_zone)

@app.route('/api/zones/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find zone with params', tags=['zone'])
@marshal_with(ZonesSchema(many=True))
@use_kwargs(ZonesSchema(exclude=("id_zone",)))
@resp.check_user_permission(dbName = "ZonesDB", method = 'GET')
def get_zone_filter(**kwargs):
    query = ZonesDB.query.filter_by(**kwargs).all()
    query_schema = ZonesSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_zone_filter)

@app.route('/api/zone/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update zone by id', tags=['zone'])
@marshal_with(ZonesSchema)
@use_kwargs(ZonesSchema(exclude=("id_zone",)))
@resp.check_user_permission(dbName = "ZonesDB", method = 'PUT')
def update_zone(id, **kwargs):  
    query = ZonesDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = ZonesSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_zone)

@app.route('/api/zone', methods=['POST'], provide_automatic_options=False)
@doc(description='Create zone', tags=['zone'])
@marshal_with(ZonesSchema)
@use_kwargs(ZonesSchema(exclude=("id_zone",)))
@resp.check_user_permission(dbName = "ZonesDB", method = 'PUT')
def create_zone(**kwargs):  
    query = ZonesDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()
    schema = ZonesSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_zone)
