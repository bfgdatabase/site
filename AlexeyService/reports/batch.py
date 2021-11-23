from datetime import datetime, timedelta


def create_report_on_batch_by_filters(id, time_start, time_end):
    query = list()

    for i in fake_data:
        if i[0] == id and (time_start is None or i[1] >= time_start) and (time_end is None or i[1] <= time_end):
            if i[2]:
                event = 'in'
            else:
                event = 'out'
            query.append({'time': i[1], 'location': f'{event} станок № {i[3]}'})

    query.reverse()  # сортировка по времени, чтобы выше было актуальное время.

    if len(query) == 0:
        return {
            'batch_id': id,
            'current_location': '',
            'last_events': list(),
        }
    if time_end is None or time_start is None:
        current_location = query[0]['location']
    else:
        tmp = list()
        for i in fake_data:
            if i[0] == id and (time_start is None or i[1] > time_start):
                if i[2]:
                    event = 'in'
                else:
                    event = 'out'
                tmp.append(f'{event} станок № {i[3]}')

        tmp.reverse()  # сортировка по времени, чтобы выше было актуальное время.
        current_location = tmp[0]
    result = {'batch_id': id, 'current_location': current_location, 'last_events': query[:4]}
    return result


time = datetime(2021, 11, 23, 0, 0, 0)

fake_data = \
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
Протестировал, всё работает.
a = create_report_on_batch_by_filters(1, None, None)
b = create_report_on_batch_by_filters(2, None, None)
c = create_report_on_batch_by_filters(3, None, None)

d = create_report_on_batch_by_filters(1, time + timedelta(minutes=35), None)
e = create_report_on_batch_by_filters(1, time, time + timedelta(minutes=35))
"""
