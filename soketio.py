from flask_socketio import SocketIO, emit

@socketio.event
def my_event(message):
    emit('my response', {'data': 'got it!'})