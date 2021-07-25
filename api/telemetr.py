from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from schemas import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc


@app.route('/api/telemetr/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all telemetrs', tags=['telemetr'])
@resp.check_user_permission(dbName = "TelemetrDB", method = 'GET')
def get_telemetrs():
    query = TelemetrDB.query.all()
    query_schema = TelemetrSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_telemetrs)

@app.route('/api/telemetr/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get telemetr by id', tags=['telemetr'])
@resp.check_user_permission(dbName = "TelemetrDB", method = 'GET')
@marshal_with(TelemetrSchema())
def get_telemetr(id):
    query = TelemetrDB.query.get_or_404(id)
    query_schema = TelemetrSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_telemetr)

@app.route('/api/telemetrs/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find telemetr with params', tags=['telemetr'])
@marshal_with(TelemetrSchema(many=True))
@use_kwargs(TelemetrSchema(exclude=("telemetr_id",)))
@resp.check_user_permission(dbName = "TelemetrDB", method = 'GET')
def find_telemetr(**kwargs):
    query = TelemetrDB.query.filter_by(**kwargs).all()
    query_schema = TelemetrSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(find_telemetr)
