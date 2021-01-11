from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc

@app.route('/api/regiser', methods = ['POST'], provide_automatic_options=False)
@doc(description='User registration', tags=['users'])
@marshal_with(UsersSchema)
@use_kwargs(UsersSchema(only=("name","username","email","password_hash","phone","info",)))
def registration(**kwargs):
    query = UsersDB()
    for key, value in kwargs.items():
        if(key == 'password_hash'):
            pass_hash = bcrypt.generate_password_hash(value, 10)  
            pass_hash_decoded = pass_hash.decode('utf-8') 
            query.password_hash = pass_hash_decoded
        else:
            setattr(query, key, value)
    query.role = ''
    db.session.add(query)
    db.session.commit()    
    return response_with(resp.SUCCESS_200)
docs.register(registration)


@app.route('/api/permissions', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all user permissions', tags=['users'])
def get_permissions():
    query = PermissionsDB.query.all()
    query_schema = PermissionsSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_permissions)

@app.route('/api/permissions', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update permission by id', tags=['users'])
@marshal_with(PermissionsSchema)
@use_kwargs(PermissionsSchema(exclude=("table", "role")))
def update_permission(**kwargs):  
    try:
        id = kwargs['id_permission']
    except:
        return response_with(resp.MISSING_PARAMETERS_422)
    query = PermissionsDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = PermissionsSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_permission)

@app.route('/api/roles', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all user roles', tags=['users'])
def get_roless():
    if("user" in session) == False:
        return response_with(FORBIDDEN_403)
    if not (session["role"] == 'administrator'):
        return response_with(FORBIDDEN_403)
    query = RolesDB.query.all()
    query_schema = RolesSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_roless)

@app.route('/api/role/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete role by id', tags=['users'])
def delete_role(id):
    query = RolesDB.query.get_or_404(id)
    name = query.role
    db.session.delete(query)
    db.session.commit()  
    query = PermissionsDB.query.filter_by(role = name)
    for q in query:
        db.session.delete(q)
        db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_role)

@app.route('/api/role', methods=['POST'], provide_automatic_options=False)
@doc(description='Create role', tags=['users'])
@marshal_with(RolesSchema)
@use_kwargs(RolesSchema(exclude=("id_role", )))
def create_role(**kwargs):  
    query = RolesDB.query()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()
    schema = RolesSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_role)
