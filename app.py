from flask import Flask, request
from config import Configuration
from flask_sqlalchemy import SQLAlchemy
from flask_security import SQLAlchemyUserDatastore
from flask_security import Security
from flask_marshmallow import Marshmallow
from apispec import APISpec
from flask_bcrypt import Bcrypt
from datetime import datetime, timezone

from threading import Lock

from flask_apispec import FlaskApiSpec
from apispec_webframeworks.flask import FlaskPlugin
from apispec.ext.marshmallow import MarshmallowPlugin

from flask_script import Manager
from flask_migrate import Migrate
from flask_socketio import SocketIO, emit

from socketio import *
import dbm

import paho.mqtt.client as paho
import threading
import time

clients = []

thread = None
thread_lock = Lock()

def background_thread():
    """Example of how to send server generated events to clients."""
    count = 0
    while True:
        socketio.sleep(10)
        count += 1
        socketio.emit('my_response',
                      {'data': 'Server generated event', 'count': count})


DB_URL = 'postgresql://{user}:{pw}@{url}/{db}'.format(user=Configuration.POSTGRES_USER,pw=Configuration.POSTGRES_PW,url=Configuration.POSTGRES_URL,db=Configuration.POSTGRES_DB)


app = Flask(__name__) 
app.secret_key = Configuration.SEKRET_KEY
app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 
app.config['UPLOAD_FOLDER'] = Configuration.UPLOAD_FOLDER
app.config['UPLOAD_FOLDER'] = Configuration.ALLOWED_EXTENSIONS
app.config.from_object(Configuration)


db = SQLAlchemy(app)

migrate = Migrate(app, db)
manager = Manager(app)

ma = Marshmallow(app)
bcrypt = Bcrypt(app)

async_mode = None

socketio = SocketIO(app, async_mode=async_mode)

opopo = 0

from models import *
from schemas import *

watchingMarks = None

app.config.update({
    'APISPEC_SPEC': APISpec(
        title='bfg-database-api',
        version='v1',
        openapi_version='2.0.0',
        plugins=[MarshmallowPlugin()],
    ),
    'APISPEC_SWAGGER_URL': '/swagger/'
})

docs = FlaskApiSpec(app)

#db.drop_all()
db.create_all()
db.session.commit()

roles = UserRolesDB.query.all()
for role in roles:
    for table in editableTables:
        query =  UserPermissionsDB.query.all()
        permissions = UserPermissionsDB.query.filter_by(table = table[0], role = role.role).all()
        if(len(permissions) == 0):
            item = UserPermissionsDB(
                table = table[0], 
                role = role.role,
                get = False,
                put = False,
                delete = False,
                )
            db.session.add(item)
            db.session.commit()   

users = UsersDB.query.filter_by(role = 'administrator').all()
if(len(users) == 0):
    pass_hash = bcrypt.generate_password_hash('pass', 10)  
    pass_hash_decoded = pass_hash.decode('utf-8')   
    admin = UsersDB(
            login = 'root',
            username = 'administrator',
            password_hash = pass_hash_decoded,
            role = 'administrator')
    db.session.add(admin)
    db.session.commit()       


## -------------------------------------------------------------------------
## -------------------------------------------------------------------------
## -------------------------------------------------------------------------

class Mark_dict(object):

    def __init__(self):
        self.mark_storage = {}

        self.client = paho.Client("pahoMQTTClient")  
        self.broker = "localhost"
        self.port = 1883
        self.client.on_message = self.on_message
        self.client.connect(self.broker, self.port)

    def append(self, name, val):
        res = self.mark_storage.get(name)
        if res is None:
            self.mark_storage[name] = [val]
            ## create thread  
            self.client.subscribe(name) 
            print("subscribe", name)   
        else:
            self.mark_storage[name].append(val)
        
    def delete(self, name, val):
        res = self.mark_storage.get(name)
        if res is not None:
            if (len(res) == 1):
                del self.mark_storage[name] 
                ## delete thread   
                self.client.unsubscribe(name)    
                print("unsubscribe", name)      
            else:
                try:
                    self.mark_storage[name].remove(val)
                except ValueError:
                    return False

    def delete_by_client_id(self, id):
        for key, val in self.mark_storage.copy().items():
            while id in val: val.remove(id)
            if (len(val) == 0):
                del self.mark_storage[key] 
                ## delete thread     
                self.client.unsubscribe(key)   
                print("unsubscribe", key)

    def on_message(self, client, userdata, message):
        mes = str(message.payload.decode("utf-8"))
        res = self.mark_storage.get(message.topic)
        if res is not None:
            for n in self.mark_storage[message.topic]:
                print ('send: ', mes, '  to client: ', n)  


watchingMarks = Mark_dict() 
watchingMarks.client.loop_start() 
    
    
@socketio.on('disconnect')
def disconnected():
    print('Client disconnected', request.sid)
    clients.remove(request.sid)
    watchingMarks.delete_by_client_id(request.sid)    
    print('stopMarkWatching', request.sid)
    
@socketio.event
def connect():
    print('Client connected!!', request.sid)
    clients.append(request.sid)

@socketio.event
def addWatchingMark(mark_id):
    watchingMarks.append(mark_id['data'], request.sid)    
    print('addWatchingMark', mark_id, request.sid)

@socketio.event
def stopMarkWatching():
    watchingMarks.delete_by_client_id(request.sid)    
    print('stopMarkWatching', request.sid)

@socketio.event
def handle_my_custom_event(json):
    print('received json: ' + str(json))