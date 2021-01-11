from flask import make_response, jsonify
from flask import Flask, session
from models import *

INVALID_FIELD_NAME_SENT_422 = {
    "http_code": 422,
    "code": "invalidField",
    "message": "Invalid fields found"
}

INVALID_INPUT_422 = {
    "http_code": 422,
    "code": "invalidInput",
    "message": "Invalid input"
}

MISSING_PARAMETERS_422 = {
    "http_code": 422,
    "code": "missingParameter",
    "message": "Missing parameters."
}

BAD_REQUEST_400 = {
    "http_code": 400,
    "code": "badRequest",
    "message": "Bad request"
}

SERVER_ERROR_500 = {
    "http_code": 500,
    "code": "serverError",
    "message": "Server error"
}

SERVER_ERROR_404 = {
    "http_code": 404,
    "code": "notFound",
    "message": "Resource not found"
}

FORBIDDEN_403 = {
    "http_code": 403,
    "code": "notAuthorized",
    "message": "You are not authorised to execute this."
}
UNAUTHORIZED_401 = {
    "http_code": 401,
    "code": "notAuthorized",
    "message": "Invalid authentication."
}

NOT_FOUND_HANDLER_404 = {
    "http_code": 404,
    "code": "notFound",
    "message": "route not found"
}

SUCCESS_200 = {
    'http_code': 200,
    'code': 'success'
}

SUCCESS_201 = {
    'http_code': 201,
    'code': 'success'
}

SUCCESS_204 = {
    'http_code': 204,
    'code': 'success'
}


def response_with(response, value=None, message=None, error=None, headers={}, pagination=None):
    result = {}
    if value is not None:
        result.update(value)

    if response.get('message', None) is not None:
        result.update({'message': response['message']})

    result.update({'code': response['code']})

    if error is not None:
        result.update({'errors': error})

    if pagination is not None:
        result.update({'pagination': pagination})

    headers.update({'Access-Control-Allow-Origin': '*'})
    headers.update({'server': 'Flask REST API'})

    return make_response(jsonify(result), response['http_code'], headers)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):        
        return f(*args, **kwargs)
    return decorated_function

def check_user_permission(dbName, method):
    def inner_decorator(f):
        def wrapped(*args, **kwargs):
            if("user" in session) == False:
                return response_with(FORBIDDEN_403)
            if(session["role"] == 'administrator'):                
                response = f(*args, **kwargs)
                return response                
            query = PermissionsDB.query.filter_by(table = dbName , role = session["role"]).one()        
            if(method == 'GET'):
                if (query.get == False):
                    return response_with(FORBIDDEN_403) 
            elif(method == 'PUT'):
                if (query.put == False):
                    return response_with(FORBIDDEN_403) 
            elif(method == 'DELETE'):
                if (query.delete == False):
                    return response_with(FORBIDDEN_403)                    
            response = f(*args, **kwargs)
            return response
        wrapped.__name__ = f.__name__
        return wrapped
    return inner_decorator

