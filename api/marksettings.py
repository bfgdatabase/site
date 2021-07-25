from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from schemas import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc


@app.route('/api/markgroupSettings/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all MarkgroupSettings', tags=['sensors'])
@resp.check_user_permission(dbName = "MarkSettingsDB", method = 'GET')
def get_markgroupsettings():
    query = MarkSettingsDB.query.all()
    query_schema = MarkSettingSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_markgroupsettings)

@app.route('/api/markgroupSetting/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete MarkgroupSetting by id', tags=['sensors'])
@resp.check_user_permission(dbName = "MarkSettingsDB", method = 'DELETE')
def delete_markgroupsetting(id):
    query = MarkSettingsDB.query.get_or_404(id)
    db.session.delete(query)
    query_marks = MarksDB.query.filter_by(markgroup_id = query.markgroup_id).all()
    for q in query_marks:
        q.set_settings = True
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_markgroupsetting)

@app.route('/api/markgroupSetting/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get MarkgroupSetting by id', tags=['sensors'])
@use_kwargs(MarkSettingSchema(exclude=("setting_id",)))
@resp.check_user_permission(dbName = "MarkSettingsDB", method = 'GET')
def get_markgroupsetting(id):
    query = MarkSettingsDB.query.get_or_404(id)
    query_schema = MarkSettingSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_markgroupsetting)

@app.route('/api/markgroupSettings/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find MarkgroupSetting with params', tags=['sensors'])
@marshal_with(MarkSettingSchema(many=True))
@use_kwargs(MarkSettingSchema(exclude=("setting_id",)))
@resp.check_user_permission(dbName = "MarkSettingsDB", method = 'GET')
def get_markgroupsetting_filter(**kwargs):
    query = MarkSettingsDB.query.filter_by(**kwargs).all()
    query_schema = MarkSettingSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_markgroupsetting_filter)

@app.route('/api/markgroupSetting/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update MarkgroupSetting by id', tags=['sensors'])
@marshal_with(MarkSettingSchema)
@use_kwargs(MarkSettingSchema(exclude=("setting_id",)))
@resp.check_user_permission(dbName = "MarkSettingsDB", method = 'PUT')
def update_markgroupsetting(id, **kwargs): 
    query = MarkSettingsDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    query_marks = MarksDB.query.filter_by(markgroup_id = query.markgroup_id).all()
    for q in query_marks:
        q.set_settings = True
    db.session.commit()
    schema = MarkSettingSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_markgroupsetting)

@app.route('/api/markgroupSetting', methods=['POST'], provide_automatic_options=False)
@doc(description='Create MarkgroupSetting', tags=['sensors'])
@marshal_with(MarkSettingSchema)
@use_kwargs(MarkSettingSchema(exclude=("setting_id",)))
@resp.check_user_permission(dbName = "MarkSettingsDB", method = 'PUT')
def create_markgroupsetting(**kwargs):  
    query = MarkSettingsDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    query_marks = MarksDB.query.filter_by(markgroup_id = query.markgroup_id).all()
    for q in query_marks:
        q.set_settings = True
    db.session.commit()
    schema = MarkSettingSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_markgroupsetting)

