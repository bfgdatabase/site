from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc

@app.route('/api/orders/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all orders', tags=['orders'])
@resp.check_user_permission(dbName = "OrdersDB", method = 'GET')
def get_orders():
    query = OrdersDB.query.all()
    query_schema = OrdersSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_orders)

@app.route('/api/orders/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find orders with params', tags=['orders'])
@marshal_with(OrdersSchema(many=True))
@use_kwargs(OrdersSchema(exclude=("id_order",)))
@resp.check_user_permission(dbName = "OrdersDB", method = 'GET')
def find_orders(**kwargs):
    query = OrdersDB.query.filter_by(**kwargs).all()
    query_schema = OrdersSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(find_orders)

@app.route('/api/order/', methods=['POST'], provide_automatic_options=False)
@doc(description='Create order', tags=['orders'])
@marshal_with(OrdersSchema)
@use_kwargs(OrdersSchema(exclude=("id_order","created","started","closed",)))
@resp.check_user_permission(dbName = "OrdersDB", method = 'PUT')
def create_orders(**kwargs):  
    query = OrdersDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    query.created = datetime.now(timezone.utc)
    db.session.add(query)
    db.session.commit()
    schema = OrdersSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_orders)

@app.route('/api/order/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update order by id', tags=['orders'])
@marshal_with(OrdersSchema)
@use_kwargs(OrdersSchema(exclude=("id_order",)))
@resp.check_user_permission(dbName = "OrdersDB", method = 'PUT')
def update_orders(id, **kwargs):  
    query = OrdersDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = OrdersSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_orders)

@app.route('/api/order/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete order by id', tags=['orders'])
@resp.check_user_permission(dbName = "OrdersDB", method = 'DELETE')
def delete_orders(id):
    query = OrdersDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_orders)

@app.route('/api/order/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get order by id', tags=['orders'])
@marshal_with(OrdersSchema())
@resp.check_user_permission(dbName = "OrdersDB", method = 'GET')
def get_order(id):
    query = OrdersDB.query.get_or_404(id)
    query_schema = OrdersSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_order)





