from flask_apispec import use_kwargs, marshal_with, doc

from app import *
from models import *
from utils import responses as resp
from utils.responses import response_with


@app.route('/api/pause/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all pauses', tags=['pause'])
@resp.check_user_permission(dbName="PauseDB", method='GET')
@marshal_with(PauseSchema())
def get_pauses():
    query = PauseDB.query.all()
    query_schema = PauseSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_pauses)


@app.route('/api/pause/', methods=['POST'], provide_automatic_options=False)
@doc(description='Create pause', tags=['pause'])
@marshal_with(PauseSchema)
@use_kwargs(PauseSchema(exclude=("pause_id", "create_time")))
@resp.check_user_permission(dbName="PauseDB", method='PUT')
def create_pause(**kwargs):
    query = PauseDB()
    for key, value in kwargs.items():
        setattr(query, key, value)
    query.create_time = datetime.now()
    db.session.add(query)
    db.session.commit()
    schema = PauseSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(create_pause)


@app.route('/api/pause/<int:id>/', methods=['PUT'], provide_automatic_options=False)
@doc(description='Update pause by id', tags=['pause'])
@marshal_with(PauseSchema)
@use_kwargs(PauseSchema(exclude=("pause_id", "create_time", "user_id")))
@resp.check_user_permission(dbName="PauseDB", method='PUT')
def update_pause(id, **kwargs):
    query = PauseDB.query.get_or_404(id)
    for key, value in kwargs.items():
        setattr(query, key, value)
    db.session.commit()
    schema = PauseSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_pause)


