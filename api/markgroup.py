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
@resp.check_user_permission(dbName = "MarkGroupDB", method = 'GET')
def get_markgroups():
    query = MarkGroupDB.query.all()
    query_schema = MarkGroupSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_markgroups)

@app.route('/api/markgroup/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete markgroup by id', tags=['sensors'])
@resp.check_user_permission(dbName = "MarkGroupDB", method = 'DELETE')
def delete_markgroup(id):
    query_childs = MarkGroupRelationsDB.query.filter_by(markgroup_id=id).all()
    for q in query_childs:
        query = MarkGroupRelationsDB.query.get_or_404(q.markGroupRelations_id)
        db.session.delete(query)
        db.session.commit()  
    query = MarkGroupDB.query.get_or_404(id)    
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_markgroup)

@app.route('/api/markgroup/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get markgroup by id', tags=['sensors'])
@use_kwargs(MarkGroupSchema(exclude=("markgroup_id",)))
@resp.check_user_permission(dbName = "MarkGroupDB", method = 'GET')
def get_markgroup(id):
    query = MarkGroupDB.query.get_or_404(id)
    query_schema = MarkGroupSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_markgroup)

@app.route('/api/markgroups/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find markgroup with params', tags=['sensors'])
@marshal_with(MarkGroupSchema(many=True))
@use_kwargs(MarkGroupSchema(exclude=("markgroup_id",)))
@resp.check_user_permission(dbName = "MarkGroupDB", method = 'GET')
def get_markgroup_filter(**kwargs):
    query = MarkGroupDB.query.filter_by(**kwargs).all()
    query_schema = MarkGroupSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_markgroup_filter)

@app.route('/api/markgroup/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update markgroup by id', tags=['sensors'])
@marshal_with(MarkGroupSchema)
@use_kwargs(MarkGroupSchema(exclude=("markgroup_id",)))
@resp.check_user_permission(dbName = "MarkGroupDB", method = 'PUT')
def update_markgroup(id, **kwargs):  
    query = MarkGroupDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = MarkGroupSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_markgroup)

@app.route('/api/markgroup', methods=['POST'], provide_automatic_options=False)
@doc(description='Create markgroup', tags=['sensors'])
@marshal_with(MarkGroupSchema)
@use_kwargs(MarkGroupSchema(exclude=("markgroup_id",)))
@resp.check_user_permission(dbName = "MarkGroupDB", method = 'PUT')
def create_markgroup(**kwargs):  
    query = MarkGroupDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()
    schema = MarkGroupSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_markgroup)


################################# MarkgroupSettings ##################################
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
    query_childs = MarkSettingsRelationsDB.query.filter_by(setting_id=id).all()
    for q in query_childs:
        query = MarkSettingsRelationsDB.query.get_or_404(q.markSettingsRelations_id)
        db.session.delete(query)
        db.session.commit()  

    query = MarkSettingsDB.query.get_or_404(id)
    db.session.delete(query)
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
    db.session.commit()
    schema = MarkSettingSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_markgroupsetting)


################################# MarkGroupRelations ##################################
@app.route('/api/markgroupRelations/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all markgroupRelations', tags=['sensors'])
@resp.check_user_permission(dbName = "MarkGroupRelationsDB", method = 'GET')
def get_markgrouprelations():
    query = MarkGroupRelationsDB.query.all()
    query_schema = MarkGroupRelationsSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_markgrouprelations)

@app.route('/api/markgrouprelation/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete markgrouprelation by id', tags=['sensors'])
@resp.check_user_permission(dbName = "MarkGroupRelationsDB", method = 'DELETE')
def delete_markgrouprelation(id):
    query = MarkGroupRelationsDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_markgrouprelation)

@app.route('/api/markgrouprelation/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get markgrouprelation by id', tags=['sensors'])
@use_kwargs(MarkGroupRelationsSchema(exclude=("markGroupRelations_id",)))
@resp.check_user_permission(dbName = "MarkGroupRelationsDB", method = 'GET')
def get_markgrouprelation(id):
    query = MarkGroupRelationsDB.query.get_or_404(id)
    query_schema = MarkGroupRelationsSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_markgrouprelation)

@app.route('/api/markgrouprelations/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find markgrouprelation with params', tags=['sensors'])
@marshal_with(MarkGroupRelationsSchema(many=True))
@use_kwargs(MarkGroupRelationsSchema(exclude=("markGroupRelations_id",)))
@resp.check_user_permission(dbName = "MarkGroupRelationsDB", method = 'GET')
def get_markgrouprelation_filter(**kwargs):
    query = MarkGroupRelationsDB.query.filter_by(**kwargs).all()
    query_schema = MarkGroupRelationsSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_markgrouprelation_filter)

@app.route('/api/markgrouprelation', methods=['POST'], provide_automatic_options=False)
@doc(description='Create markgrouprelation', tags=['sensors'])
@marshal_with(MarkGroupRelationsSchema)
@use_kwargs(MarkGroupRelationsSchema(exclude=("markGroupRelations_id",)))
@resp.check_user_permission(dbName = "MarkGroupRelationsDB", method = 'PUT')
def create_markgrouprelation(**kwargs):  
    query = MarkGroupRelationsDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()
    schema = MarkGroupRelationsSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_markgrouprelation)

################################# MarkSettingsRelations ##################################
@app.route('/api/markSettingsRelations/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all MarkSettingsRelations', tags=['sensors'])
@resp.check_user_permission(dbName = "MarkSettingsRelationsDB", method = 'GET')
def get_marksettingsrelations():
    query = MarkSettingsRelationsDB.query.all()
    query_schema = MarkSettingsRelationsSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_marksettingsrelations)

@app.route('/api/markSettingsRelations/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete markSettingsRelations by id', tags=['sensors'])
@resp.check_user_permission(dbName = "MarkSettingsRelationsDB", method = 'DELETE')
def delete_marksettingsrelations(id):
    query = MarkSettingsRelationsDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_marksettingsrelations)

@app.route('/api/markSettingsRelations/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get markSettingsRelations by id', tags=['sensors'])
@use_kwargs(MarkSettingsRelationsSchema(exclude=("markSettingsRelations_id",)))
@resp.check_user_permission(dbName = "MarkSettingsRelationsDB", method = 'GET')
def markSettingsRelations(id):
    query = MarkSettingsRelationsDB.query.get_or_404(id)
    query_schema = MarkSettingsRelationsSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_marksettingsrelations)

@app.route('/api/markSettingsRelations/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find markSettingsRelations with params', tags=['sensors'])
@marshal_with(MarkSettingsRelationsSchema(many=True))
@use_kwargs(MarkSettingsRelationsSchema(exclude=("markSettingsRelations_id",)))
@resp.check_user_permission(dbName = "MarkSettingsRelationsDB", method = 'GET')
def get_marksettingsrelations_filter(**kwargs):
    query = MarkSettingsRelationsDB.query.filter_by(**kwargs).all()
    query_schema = MarkSettingsRelationsSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_marksettingsrelations_filter)

@app.route('/api/markSettingsRelation', methods=['POST'], provide_automatic_options=False)
@doc(description='Create markSettingsRelations', tags=['sensors'])
@marshal_with(MarkSettingsRelationsSchema)
@use_kwargs(MarkSettingsRelationsSchema(exclude=("markSettingsRelations_id",)))
@resp.check_user_permission(dbName = "MarkSettingsRelationsDB", method = 'PUT')
def create_marksettingsrelations(**kwargs):  
    query = MarkSettingsRelationsDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()
    schema = MarkSettingsRelationsSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_marksettingsrelations)
