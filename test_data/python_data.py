from datetime import datetime, timedelta

from models import BatchDB

time = datetime(2021, 11, 23, 0, 0, 0)

"""
Партия\метка , время события, Событие in - True, out- false, номер оборудования.
"""
in_out_events = \
    [
        [1, time, True, 1],
        [1, time + timedelta(minutes=10), False, 1],
        [1, time + timedelta(minutes=15), True, 2],
        [1, time + timedelta(minutes=35), False, 2],
        [1, time + timedelta(minutes=40), True, 3],
        [2, time + timedelta(minutes=10), True, 5],
        [2, time + timedelta(minutes=40), False, 5],
        [2, time + timedelta(minutes=50), True, 6],
        [2, time + timedelta(minutes=80), False, 6],
        [2, time + timedelta(minutes=90), True, 7],
        [2, time + timedelta(minutes=140), False, 7],
        [3, time + timedelta(minutes=20), True, 1],
        [3, time + timedelta(minutes=200), False, 1],
    ]


"""
Откуда, до куда, за сколько минут. На одну деталь.
1, 1, 100 означает, что от 1 In до 1 out 100 минут.
1, 2, 10 означает, что от 1 Out до 2 in 10 минут.
"""
technology = \
    [
        [1, 1, 100],
        [1, 2, 10],
        [2, 2, 60],
        [2, 3, 15],
        [3, 3, 200],
    ]

"""
Партии
ID партии ; код спецификации; время создания ; ID метки, к которой привязана партия ;
количество деталей ; название ; время закрытия партии ; ID маршрута ;
"""
batches = [
    [1, 'A1', str(time), 1, 200, 'Гвозди', '-', 1],
    [2, 'ГОСТ 123', str(time), 2, 1000, 'Гайки', '-', 2],
    [3, 'Ru18', str(time), 3, 1000, 'Болты', '-', 3]
]
