
from flask import Flask
from flask import request, jsonify

app = Flask(__name__)
client = app.test_client()


app.port = 5000
app.testing = True