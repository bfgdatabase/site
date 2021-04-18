from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc


################################# MarkgroupSettings ##################################
@app.route('/api/markgroups/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all markgroups', tags=['sensors'])
@resp.check_user_permission(dbName = "MarkgroupDB", method = 'GET')
def get_markgroups():
    query = MarkgroupDB.query.all()
    query_schema = MarkgroupSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_markgroups)

@app.route('/api/markgroup/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete markgroup by id', tags=['sensors'])
@resp.check_user_permission(dbName = "MarkgroupDB", method = 'DELETE')
def delete_markgroup(id):
    query = MarkgroupDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_markgroup)

@app.route('/api/markgroup/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get markgroup by id', tags=['sensors'])
@use_kwargs(MarkgroupSchema(exclude=("markgroup_id",)))
@resp.check_user_permission(dbName = "MarkgroupDB", method = 'GET')
def get_markgroup(id):
    query = MarkgroupDB.query.get_or_404(id)
    query_schema = MarkgroupSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_markgroup)

@app.route('/api/markgroups/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find markgroup with params', tags=['sensors'])
@marshal_with(MarkgroupSchema(many=True))
@use_kwargs(MarkgroupSchema(exclude=("markgroup_id",)))
@resp.check_user_permission(dbName = "MarkgroupDB", method = 'GET')
def get_markgroup_filter(**kwargs):
    query = MarkgroupDB.query.filter_by(**kwargs).all()
    query_schema = MarkgroupSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_markgroup_filter)

@app.route('/api/markgroup/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update markgroup by id', tags=['sensors'])
@marshal_with(MarkgroupSchema)
@use_kwargs(MarkgroupSchema(exclude=("markgroup_id",)))
@resp.check_user_permission(dbName = "MarkgroupDB", method = 'PUT')
def update_markgroup(id, **kwargs):  
    query = MarkgroupDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = MarkgroupSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_markgroup)

@app.route('/api/markgroup', methods=['POST'], provide_automatic_options=False)
@doc(description='Create markgroup', tags=['sensors'])
@marshal_with(MarkgroupSchema)
@use_kwargs(MarkgroupSchema(exclude=("markgroup_id",)))
@resp.check_user_permission(dbName = "MarkgroupDB", method = 'PUT')
def create_markgroup(**kwargs):  
    query = MarkgroupDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()
    schema = MarkgroupSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_markgroup)


################################# MarkgroupSettings ##################################
@app.route('/api/markgroupSettings/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all MarkgroupSettings', tags=['sensors'])
@resp.check_user_permission(dbName = "MarkgroupSettingsDB", method = 'GET')
def get_markgroupsettings():
    query = MarkgroupSettingsDB.query.all()
    query_schema = MarkgroupSettingsSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_markgroupsettings)

@app.route('/api/markgroupSetting/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete MarkgroupSetting by id', tags=['sensors'])
@resp.check_user_permission(dbName = "MarkgroupSettingsDB", method = 'DELETE')
def delete_markgroupsetting(id):
    query = MarkgroupSettingsDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_markgroupsetting)

@app.route('/api/markgroupSetting/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get MarkgroupSetting by id', tags=['sensors'])
@use_kwargs(MarkgroupSettingsSchema(exclude=("setting_id",)))
@resp.check_user_permission(dbName = "MarkgroupSettingsDB", method = 'GET')
def get_markgroupsetting(id):
    query = MarkgroupSettingsDB.query.get_or_404(id)
    query_schema = MarkgroupSettingsSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_markgroupsetting)

@app.route('/api/markgroupSettings/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find MarkgroupSetting with params', tags=['sensors'])
@marshal_with(MarkgroupSettingsSchema(many=True))
@use_kwargs(MarkgroupSettingsSchema(exclude=("setting_id",)))
@resp.check_user_permission(dbName = "MarkgroupSettingsDB", method = 'GET')
def get_markgroupsetting_filter(**kwargs):
    query = MarkgroupSettingsDB.query.filter_by(**kwargs).all()
    query_schema = MarkgroupSettingsSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_markgroupsetting_filter)

@app.route('/api/markgroupSetting/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update MarkgroupSetting by id', tags=['sensors'])
@marshal_with(MarkgroupSettingsSchema)
@use_kwargs(MarkgroupSettingsSchema(exclude=("setting_id",)))
@resp.check_user_permission(dbName = "MarkgroupSettingsDB", method = 'PUT')
def update_markgroupsetting(id, **kwargs):  
    query = MarkgroupSettingsDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = MarkgroupSettingsSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_markgroupsetting)

@app.route('/api/markgroupSetting', methods=['POST'], provide_automatic_options=False)
@doc(description='Create MarkgroupSetting', tags=['sensors'])
@marshal_with(MarkgroupSettingsSchema)
@use_kwargs(MarkgroupSettingsSchema(exclude=("setting_id",)))
@resp.check_user_permission(dbName = "MarkgroupSettingsDB", method = 'PUT')
def create_markgroupsetting(**kwargs):  
    query = MarkgroupSettingsDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()
    schema = MarkgroupSettingsSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_markgroupsetting)


################################# markgrouprelation ##################################
@app.route('/api/markgroupRelations/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all markgroupRelations', tags=['sensors'])
@resp.check_user_permission(dbName = "MarkgroupRelationsDB", method = 'GET')
def get_markgrouprelations():
    query = MarkgroupRelationsDB.query.all()
    query_schema = MarkgroupRelationsSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_markgrouprelations)

@app.route('/api/markgrouprelation/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete markgrouprelation by id', tags=['sensors'])
@resp.check_user_permission(dbName = "MarkgroupRelationsDB", method = 'DELETE')
def delete_markgrouprelation(id):
    query = MarkgroupRelationsDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_markgrouprelation)

@app.route('/api/markgrouprelation/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get markgrouprelation by id', tags=['sensors'])
@use_kwargs(MarkgroupRelationsSchema(exclude=("markgroupTable_id",)))
@resp.check_user_permission(dbName = "MarkgroupRelationsDB", method = 'GET')
def get_markgrouprelation(id):
    query = MarkgroupRelationsDB.query.get_or_404(id)
    query_schema = MarkgroupRelationsSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_markgrouprelation)

@app.route('/api/markgrouprelations/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find markgrouprelation with params', tags=['sensors'])
@marshal_with(MarkgroupRelationsSchema(many=True))
@use_kwargs(MarkgroupRelationsSchema(exclude=("markgroupTable_id",)))
@resp.check_user_permission(dbName = "MarkgroupRelationsDB", method = 'GET')
def get_markgrouprelation_filter(**kwargs):
    query = MarkgroupRelationsDB.query.filter_by(**kwargs).all()
    query_schema = MarkgroupRelationsSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_markgrouprelation_filter)

@app.route('/api/markgrouprelation', methods=['POST'], provide_automatic_options=False)
@doc(description='Create markgrouprelation', tags=['sensors'])
@marshal_with(MarkgroupRelationsSchema)
@use_kwargs(MarkgroupRelationsSchema(exclude=("markgroupTable_id",)))
@resp.check_user_permission(dbName = "MarkgroupRelationsDB", method = 'PUT')
def create_markgrouprelation(**kwargs):  
    query = MarkgroupRelationsDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()
    schema = MarkgroupRelationsSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_markgrouprelation)