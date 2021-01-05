from app import app
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import *
from flask_sqlalchemy import SQLAlchemy
from app import *
from utils.responses import response_with
from utils import responses as resp
from flask_apispec import use_kwargs, marshal_with

@app.route('/api/anchors', methods=['GET'])
def get_ancors():
    query = AnchorsDB.query.all()
    query_schema = AnchorsSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_ancors)

@app.route('/api/anchor/<int:id>/', methods=['DELETE'])
def delete_ancor(id):
    """Annotate the decorated view function or class with the specified Swagger
    attributes.

    Usage:

    .. code-block:: python

        @doc(tags=['pet'], description='a pet store')
        def get_pet(pet_id):
            return Pet.query.filter(Pet.id == pet_id).one()

    :param inherit: Inherit Swagger documentation from parent classes
    """
    query = AnchorsDB.query.get_or_404(id)
    db.session.delete(query)
    db.session.commit()  
    return response_with(resp.SUCCESS_200)
docs.register(delete_ancor)

@app.route('/api/anchor/<int:id>/', methods=['GET'])
@marshal_with(AnchorsSchema())
def get_ancor(id):
    query = AnchorsDB.query.get_or_404(id)
    query_schema = AnchorsSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})
docs.register(get_ancor)

@app.route('/api/anchor', methods=['POST'])
@marshal_with(AnchorsSchema)
@use_kwargs(AnchorsSchema)
def update_ancor(**kwargs):
    ddd = kwargs
    data = request.get_json()
    query.id_gate = data['id_gate']
    query.name = data['name']
    query.gain = data['gain']
    db.session.add(query)
    db.session.commit()
    schema = AnchorsSchema()
    return response_with(resp.SUCCESS_200, value={"query": schema.dump(query)})
docs.register(update_ancor)

@app.route('/anhcors')
def ancors():
    return render_template('anchorsTable.html')

@app.route('/')
def test():
    with app.test_client() as c:
        rv = c.get('/api/anchors')
        json_data = rv.get_json()
        print(json_data)
    return json_data


@app.route('/tst', methods=['POST'])
@use_kwargs(TstSchema)
@marshal_with(TstSchema)
def update_tst(**kwargs):
    new_one = kwargs
    '''
    user_id = get_jwt_identity()
    new_one = Video(user_id=user_id, **kwargs)
    session.add(new_one)
    session.commit()
    '''
    return 1
docs.register(update_tst)

@app.route('/tutorials', methods=['POST'])
@use_kwargs(VideoSchema)
@marshal_with(VideoSchema)
def update_list(**kwargs):
    new_one = kwargs
    '''
    user_id = get_jwt_identity()
    new_one = Video(user_id=user_id, **kwargs)
    session.add(new_one)
    session.commit()
    '''
    return 1
docs.register(update_list)


'''
@book_routes.route('/<int:id>', methods=['DELETE'])
@jwt_required
def delete_book(id):
    get_book = Book.query.get_or_404(id)
    db.session.delete(get_book)
    db.session.commit()
    return response_with(resp.SUCCESS_204)


@book_routes.route('/api/anchors/<id>', methods=['PUT'])
@jwt_required
def update_book_detail(id):
    data = request.get_json()
    get_book = Book.query.get_or_404(id)
    get_book.title = data['title']
    get_book.year = data['year']
    db.session.add(get_book)
    db.session.commit()
    book_schema = BookSchema()
    book, error = book_schema.dump(get_book)
    return response_with(resp.SUCCESS_200, value={"book": book})

@book_routes.route('/<int:id>', methods=['PUT'])
@jwt_required
def update_book_detail(id):
    data = request.get_json()
    get_book = Book.query.get_or_404(id)
    get_book.title = data['title']
    get_book.year = data['year']
    db.session.add(get_book)
    db.session.commit()
    book_schema = BookSchema()
    book, error = book_schema.dump(get_book)
    return response_with(resp.SUCCESS_200, value={"book": book})

@book_routes.route('/<int:id>', methods=['PATCH'])
@jwt_required
def modify_book_detail(id):
    data = request.get_json()
    get_book = Book.query.get_or_404(id)
    if data.get('title'):
        get_book.title = data['title']
    if data.get('year'):
        get_book.year = data['year']
    db.session.add(get_book)
    db.session.commit()
    book_schema = BookSchema()
    book, error = book_schema.dump(get_book)
    return response_with(resp.SUCCESS_200, value={"book": book})

@book_routes.route('/<int:id>', methods=['DELETE'])
@jwt_required
def delete_book(id):
    get_book = Book.query.get_or_404(id)
    db.session.delete(get_book)
    db.session.commit()
    return response_with(resp.SUCCESS_204)
'''