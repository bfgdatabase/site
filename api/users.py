from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc

@app.route('/api/regiser/', methods = ['POST'], provide_automatic_options=False)
@doc(description='User registration', tags=['users'])
@marshal_with(UsersSchema)
@use_kwargs(UsersSchema(only=("login","username","email","password_hash","phone","info",)))
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


@app.route('/api/permissions/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all user permissions', tags=['users'])
def get_permissions():
    if("login" in session) == False:
        return response_with(FORBIDDEN_403)
    if not (session["role"] == 'administrator'):
        return response_with(FORBIDDEN_403)
    query = PermissionsDB.query.order_by("role").order_by("table").all()
    query_schema = PermissionsSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_permissions)


@app.route('/api/permissions/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update permission by id', tags=['users'])
@marshal_with(PermissionsSchema)
@use_kwargs(PermissionsSchema(exclude=("table", "role", "id_permission")))
def update_permission(id, **kwargs):  
    if("login" in session) == False:
        return response_with(FORBIDDEN_403)
    if not (session["role"] == 'administrator'):
        return response_with(FORBIDDEN_403)
    query = PermissionsDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = PermissionsSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_permission)

@app.route('/api/roles/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all user roles', tags=['users'])
def get_roless():
    if("login" in session) == False:
        return response_with(FORBIDDEN_403)
    if not (session["role"] == 'administrator'):
        return response_with(FORBIDDEN_403)
    query = RolesDB.query.order_by("role").all()
    query_schema = RolesSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_roless)

@app.route('/api/role/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete role by id', tags=['users'])
def delete_role(id):
    if("login" in session) == False:
        return response_with(FORBIDDEN_403)
    if not (session["role"] == 'administrator'):
        return response_with(FORBIDDEN_403)
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

@app.route('/api/role/', methods=['POST'], provide_automatic_options=False)
@doc(description='Create role', tags=['users'])
@marshal_with(RolesSchema)
@use_kwargs(RolesSchema(exclude=("id_role", )))
def create_role(**kwargs):  
    if("login" in session) == False:
        return response_with(FORBIDDEN_403)
    if not (session["role"] == 'administrator'):
        return response_with(FORBIDDEN_403)
    query = RolesDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()
    schema = RolesSchema()
    roles = RolesDB.query.all()
    for role in roles:
        for table in editableTables:
            query = PermissionsDB.query.all()
            permissions = PermissionsDB.query.filter_by(table = table, role = role.role)
            if(permissions.count() == 0):
                item = PermissionsDB(
                    table = table, 
                    role = role.role,
                    get = False,
                    put = False,
                    delete = False,
                    )
                db.session.add(item)
                db.session.commit()   
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_role)

@app.route('/api/users/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all users', tags=['users'])
def get_users():
    if("login" in session) == False:
        return response_with(FORBIDDEN_403)
    if not (session["role"] == 'administrator'):
        return response_with(FORBIDDEN_403)
    query = UsersDB.query.order_by("login").all()
    query_schema = UsersSchema(many=True, exclude=("password_hash", ))
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_users)

@app.route('/api/user/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete user by id', tags=['users'])
def delete_user(id):
    if("login" in session) == False:
        return response_with(FORBIDDEN_403)
    if not (session["role"] == 'administrator'):
        return response_with(FORBIDDEN_403)
    query = UsersDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()     
    return response_with(resp.SUCCESS_200)
docs.register(delete_user)

@app.route('/api/user/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update user by id', tags=['users'])
@marshal_with(PermissionsSchema)
@use_kwargs(UsersSchema(exclude=("user_id", "password_hash")))
def update_user(id, **kwargs):  
    if("login" in session) == False:
        return response_with(FORBIDDEN_403)
    if not (session["role"] == 'administrator'):
        return response_with(FORBIDDEN_403)
    query = UsersDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = UsersSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_user)


