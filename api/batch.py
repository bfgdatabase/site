import random

from AlexeyService.common import metrics_lag, criterion_lag
from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from schemas import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from test_data.python_data import technology
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with, doc

"""
@app.route('/api/batch/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all batches', tags=['batch'])
@resp.check_user_permission(dbName = "BatchDB", method = 'GET')
def get_batches():
    query = BatchDB.query.all()
    query_schema = BatchSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_batches)
"""


@app.route('/api/batch/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all batches', tags=['batch'])
@resp.check_user_permission(dbName="BatchDB", method='GET')
def get_batches():
    """
    Список всех партий.
    ID партии ; код спецификации; время создания ; ID метки, к которой привязана партия ;
    количество деталей ; название ; время закрытия партии ; ID маршрута ;
    метрика отставания ; критика отставания ; время на сколько отстаёт\опережает ;
    время до завершения ; название зоны, текущего местоположения

    TODO Убрать тестовые данные.
    """
    query = BatchDB.query.all()
    matrix = list()
    index = 0
    for i in query:
        matrix.append(list())
        hour = random.randint(0, 23)
        r = random.random()
        if r > 0.5:
            first = 2
        else:
            first = 1
        second = first
        r = random.random()
        if r > 0.5:
            second += 1
        if first == second:
            location = f'В пути со станка №{first} на станок №{first + 1}'
        else:
            location = f'На станке №{second}'

        metrics = metrics_lag(datetime(2021, 11, 29, hour, 0, 0), (first, second), technology, i.batch_size)
        critics = criterion_lag(metrics[0])
        matrix[index].append([i.batch_id, i.code, i.created_at, i.id_mark, i.batch_size, i.product_name, i.closed,
                             i.i.route_id, metrics[0], critics, metrics[1], metrics[2], location])
    return response_with(resp.SUCCESS_200, value={"query": matrix})


docs.register(get_batches)


@app.route('/api/batch/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get batch by id', tags=['batch'])
@resp.check_user_permission(dbName="BatchDB", method='GET')
@marshal_with(BatchSchema())
def get_batch(id):
    query = BatchDB.query.get_or_404(id)
    query_schema = BatchSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})


docs.register(get_batch)


@app.route('/api/batch/', methods=['POST'], provide_automatic_options=False)
@doc(description='Create batch', tags=['batch'])
@marshal_with(BatchSchema)
@use_kwargs(BatchSchema(exclude=("batch_id",)))
@resp.check_user_permission(dbName="BatchDB", method='PUT')
def create_batch(**kwargs):
    query = BatchDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.add(query)
    db.session.commit()
    schema = BatchSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})


docs.register(create_batch)


@app.route('/api/batches/', methods=['POST'], provide_automatic_options=False)
@doc(description='Find batch with params', tags=['batch'])
@marshal_with(BatchSchema(many=True))
@use_kwargs(BatchSchema(exclude=("batch_id",)))
@resp.check_user_permission(dbName="BatchDB", method='GET')
def find_batch(**kwargs):
    query = BatchDB.query.filter_by(**kwargs).all()
    query_schema = BatchSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})


docs.register(find_batch)


@app.route('/api/batch/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update batch by id', tags=['batch'])
@marshal_with(BatchSchema)
@use_kwargs(BatchSchema(exclude=("batch_id",)))
@resp.check_user_permission(dbName="BatchDB", method='PUT')
def update_batch(id, **kwargs):
    query = BatchDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = BatchSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})


docs.register(update_batch)


@app.route('/api/batch/<int:id>/', methods=['DELETE'], provide_automatic_options=False)
@doc(description='Delete batch by id', tags=['batch'])
@resp.check_user_permission(dbName="BatchDB", method='DELETE')
def delete_batch(id):
    query = BatchDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()
    return response_with(resp.SUCCESS_200)


docs.register(delete_batch)
