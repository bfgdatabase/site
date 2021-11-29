from datetime import datetime, timedelta

# from models import BatchDB, TechDB
from test_data.python_data import technology

metrics_interval = 10  # Будет отображение на отрезок [-10 : 10]


def criterion_lag(metric: int) -> str:
    """
    Оценка того, на сколько отстаёт партия или опережает, по её метрике.
    Константная функция, сильно зависит от интервала отобраения.
    """
    if metric <= -4:
        return 'Сильно отстаёт'
    if metric <= -2:
        return 'Отстаёт'
    if metric <= 2:
        return 'По графику'
    if metric <= 4:
        return 'Опережает'
    return 'Сильно опережает'


def metrics_lag(time_start: datetime, last_event: (int, int), standart_times_work: list, count: int) \
        -> (int, timedelta, timedelta):
    """
    Метрика отставания.
    Метод который вычисляет на сколько отстаёт или опережает график, конкретная партия и ставит в соответствие число.
    Возвращает: метрику, на сколько отстаёт\опережает, сколько времени осталось.

    TODO добавить паузы.
    TODO суммартное время по нормативу для всей партии, должно вычисляться в самом начале для партии и записываться в базу
    Потому что, даже если поменяется количество деталей, нам всё-равно надо знать, опережаем мы первоначальный график или нет.
    """
    now = datetime.now()
    delta_from_start = now - time_start

    i = 0
    standart_times_from_start = timedelta()
    while i < len(standart_times_work) and (standart_times_work[i][0] != last_event[0] or
                                            standart_times_work[i][1] != last_event[1]):
        tmp = timedelta(minutes=standart_times_work[i][2])

        # Если это операция на оборудовании, тогда время зависит от кол-ва деталей.
        if standart_times_work[i][0] == standart_times_work[i][1]:
            tmp *= count
        standart_times_from_start += tmp
        i += 1

    time_left = timedelta()
    while i < len(standart_times_work):
        tmp = timedelta(minutes=standart_times_work[i][2])

        # Если это операция на оборудовании, тогда время зависит от кол-ва деталей.
        if standart_times_work[i][0] == standart_times_work[i][1]:
            tmp *= count
        time_left += tmp
        i += 1

    standart = standart_times_from_start + time_left
    fact = delta_from_start + time_left

    metrics = (standart - fact) * metrics_interval / standart
    if abs(metrics) > metrics_interval:
        if metrics < 0:
            metrics = -metrics_interval
        else:
            metrics = metrics_interval
    real_delta = abs(standart - fact)
    return metrics, real_delta, time_left


"""
a = metrics_lag(datetime(2021, 11, 29, 10, 0, 0), (1, 2), technology, 2)
b = 2
"""
