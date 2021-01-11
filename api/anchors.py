from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc

@app.route('/api/anchors', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all anchors', tags=['anchor'])
@resp.check_user_permission(dbName = "AnchorsDB", method = 'GET')
def get_ancors():
    query = AnchorsDB.query.all()
    query_schema = AnchorsSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_ancors)

@app.route('/api/anchor/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete anchor by id', tags=['anchor'])
@resp.check_user_permission(dbName = "AnchorsDB", method = 'DELETE')
def delete_ancor(id):
    query = AnchorsDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_ancor)

@app.route('/api/ancor_in_lication/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get anchors in location', tags=['anchor'])
@marshal_with(AnchorsSchema(many=True))
@resp.check_user_permission(dbName = "AnchorsDB", method = 'GET')
def get_ancor_in_lication(id):
    query = AnchorsDB.query.filter_by(id_location = id)
    query_schema = AnchorsSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_ancor_in_lication)

@app.route('/api/anchor/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get anchor by id', tags=['anchor'])
@resp.check_user_permission(dbName = "AnchorsDB", method = 'GET')
@marshal_with(AnchorsSchema())
def get_ancor(id):
    query = AnchorsDB.query.get_or_404(id)
    query_schema = AnchorsSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_ancor)

@app.route('/api/anchor', methods=['POST'], provide_automatic_options=False)
@doc(description='Create anchor', tags=['anchor'])
@resp.check_user_permission(dbName = "AnchorsDB", method = 'PUT')
@marshal_with(AnchorsSchema)
@use_kwargs(AnchorsSchema(only=("gain","id_gate", "id_location", "mac", "name", "x_pos", "y_pos")))
def create_ancor(**kwargs):  
    query = AnchorsDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()   
    schema = AnchorsSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_ancor)

@app.route('/api/anchor', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update anchor by id', tags=['anchor'])
@resp.check_user_permission(dbName = "AnchorsDB", method = 'PUT')
@marshal_with(AnchorsSchema)
@use_kwargs(AnchorsSchema)
def update_ancor(**kwargs):  
    try:
        id = kwargs['id_anchor']
    except:
        return response_with(resp.MISSING_PARAMETERS_422)
    query = AnchorsDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = AnchorsSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_ancor)


