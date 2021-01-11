from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc

@app.route('/api/equipment', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all equipment', tags=['equipment'])
@resp.check_user_permission(dbName = "EquipmentDB", method = 'GET')
def get_equipment():
    query = EquipmentDB.query.all()
    query_schema = EquipmentSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_equipment)

@app.route('/api/equipment', methods=['POST'], provide_automatic_options=False)
@doc(description='Create equipment', tags=['equipment'])
@marshal_with(EquipmentSchema)
@use_kwargs(EquipmentSchema(exclude=("equipment_id",)))
@resp.check_user_permission(dbName = "EquipmentDB", method = 'PUT')
def create_equipment(**kwargs):  
    query = EquipmentDB.query()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()
    schema = EquipmentSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_equipment)

@app.route('/api/equipment/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update equipment by id', tags=['equipment'])
@resp.check_user_permission(dbName = "EquipmentDB", method = 'PUT')
@marshal_with(EquipmentSchema)
@use_kwargs(EquipmentSchema(exclude=("equipment_id",)))
def update_equipment(**kwargs):  
    query = EquipmentDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = EquipmentSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_equipment)

@app.route('/api/equipment/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete equipment by id', tags=['equipment'])
@resp.check_user_permission(dbName = "EquipmentDB", method = 'DELETE')
def delete_equipment(id):
    query = EquipmentDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_equipment)






