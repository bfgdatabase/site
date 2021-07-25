from flask import Flask
from config import Configuration
from flask_sqlalchemy import SQLAlchemy
from flask_security import SQLAlchemyUserDatastore
from flask_security import Security
from flask_marshmallow import Marshmallow
from apispec import APISpec
from flask_bcrypt import Bcrypt
from datetime import datetime, timezone

from flask_apispec import FlaskApiSpec
from apispec_webframeworks.flask import FlaskPlugin
from apispec.ext.marshmallow import MarshmallowPlugin

from flask_script import Manager
from flask_migrate import Migrate

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

from models import *
from schemas import *

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

