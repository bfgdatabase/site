from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc

@app.route('/api/department', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all department', tags=['department'])
@resp.check_user_permission(dbName = "DepartmentDB", method = 'GET')
def get_department():
    query = DepartmentDB.query.all()
    query_schema = DepartmentSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_department)

@app.route('/api/department', methods=['POST'], provide_automatic_options=False)
@doc(description='Create department', tags=['department'])
@marshal_with(DepartmentSchema)
@use_kwargs(DepartmentSchema(exclude=("dept_id",)))
@resp.check_user_permission(dbName = "DepartmentDB", method = 'PUT')
def create_department(**kwargs):  
    query = DepartmentDB.query()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()
    schema = DepartmentSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_department)

@app.route('/api/department/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update department by id', tags=['department'])
@resp.check_user_permission(dbName = "DepartmentDB", method = 'PUT')
@marshal_with(DepartmentSchema)
@use_kwargs(DepartmentSchema)
def update_department(**kwargs):  
    query = DepartmentDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = DepartmentSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_department)

@app.route('/api/department/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete department by id', tags=['department'])
@resp.check_user_permission(dbName = "DepartmentDB", method = 'DELETE')
def delete_department(id):
    query = DepartmentDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_department)

@app.route('/api/department_in_enterprise/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get department in enterprise', tags=['department'])
@marshal_with(AnchorsSchema(many=True))
@resp.check_user_permission(dbName = "DepartmentDB", method = 'GET')
def get_department_in_enterprise(id):
    query = DepartmentDB.query.filter_by(ent_id = id)
    query_schema = DepartmentDB(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_department_in_enterprise)




