from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc

@app.route('/api/departments/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all department', tags=['department'])
@resp.check_user_permission(dbName = "DepartmentDB", method = 'GET')
def get_departments():
    query = DepartmentDB.query.all()
    query_schema = DepartmentSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_departments)

@app.route('/api/department/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get department by id', tags=['department'])
@resp.check_user_permission(dbName = "DepartmentDB", method = 'GET')
@marshal_with(DepartmentSchema())
def get_department(id):
    query = DepartmentDB.query.get_or_404(id)
    query_schema = DepartmentSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_department)

@app.route('/api/departments/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find departments with params', tags=['department'])
@marshal_with(DepartmentSchema(many=True))
@use_kwargs(DepartmentSchema(exclude=("dept_id",)))
@resp.check_user_permission(dbName = "DepartmentDB", method = 'GET')
def find_departments(**kwargs):
    query = DepartmentDB.query.filter_by(**kwargs).all()
    query_schema = DepartmentSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(find_departments)

@app.route('/api/department/', methods=['POST'], provide_automatic_options=False)
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
@use_kwargs(DepartmentSchema(exclude=("dept_id",)))
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





