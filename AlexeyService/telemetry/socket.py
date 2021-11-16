import pickle

import zmq

from AlexeyService.main import timedelta_background_handler, redis_connection


def run_telemetry_socket():
    """
    Запускает сокет для телементрии.
    В него приходят данные телеметрии(температура, координаты, время и т.д.) с меток.
    Задача данные получить и положить в оперативные данные.
    """
    context = zmq.Context()
    socket = context.socket(zmq.REP)
    socket.bind('tcp://127.0.0.1:43000')

    while True:
        try:
            data = pickle.loads(socket.recv())
            save(data)
            socket.send(b'ok')

        except Exception as e:
            print(e)


def save(data):
    for i in data:
        redis_connection.setex(name=i['type_id'], value=i, time=timedelta_background_handler * 2)
