from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from schemas import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc


@app.route('/api/anchors/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all anchors', tags=['anchor'])
@resp.check_user_permission(dbName = "AnchorsDB", method = 'GET')
def get_ancors():
    query = AnchorsDB.query.all()
    query_schema = AnchorsSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_ancors)

@app.route('/api/anchor/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get anchor by id', tags=['anchor'])
@resp.check_user_permission(dbName = "AnchorsDB", method = 'GET')
@marshal_with(AnchorsSchema())
def get_ancor(id):
    query = AnchorsDB.query.get_or_404(id)
    query_schema = AnchorsSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_ancor)

@app.route('/api/anchors/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find anchor with params', tags=['anchor'])
@marshal_with(AnchorsSchema(many=True))
@use_kwargs(AnchorsSchema(exclude=("id_anchor",)))
@resp.check_user_permission(dbName = "ZonesDB", method = 'GET')
def find_anchors(**kwargs):
    query = AnchorsDB.query.filter_by(**kwargs).all()
    query_schema = AnchorsSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(find_anchors)

@app.route('/api/anchor/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete anchor by id', tags=['anchor'])
@resp.check_user_permission(dbName = "AnchorsDB", method = 'DELETE')
def delete_ancor(id):
    query = AnchorsDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_ancor)

@app.route('/api/anchor/', methods=['POST'], provide_automatic_options=False)
@doc(description='Create anchor', tags=['anchor'])
@marshal_with(AnchorsSchema)
@use_kwargs(AnchorsSchema(exclude=("id_anchor",)))
@resp.check_user_permission(dbName = "AnchorsDB", method = 'PUT')
def create_ancor(**kwargs):  
    query = AnchorsDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()   
    schema = AnchorsSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_ancor)

@app.route('/api/anchor/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update anchor by id', tags=['anchor'])
@marshal_with(AnchorsSchema)
@use_kwargs(AnchorsSchema(exclude=("id_anchor",)))
@resp.check_user_permission(dbName = "AnchorsDB", method = 'PUT')
def update_ancor(id, **kwargs):  
    query = AnchorsDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = AnchorsSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_ancor)