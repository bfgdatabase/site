from datetime import datetime, timedelta

from test_data.python_data import in_out_events


def create_report_on_batch_by_filters(id):
    query = list()

    for i in in_out_events:
        if i[0] == id: # and (time_start is None or i[1] >= time_start) and (time_end is None or i[1] <= time_end):
            if i[2]:
                event = 'in'
            else:
                event = 'out'
            query.append({'time': str(i[1]), 'location': f'{event} станок № {i[3]}'})

    query.reverse()  # сортировка по времени, чтобы выше было актуальное время.

    if len(query) == 0:
        return {
            'batch_id': id,
            'current_location': '',
            'events': list(),
        }
    #if time_end is None or time_start is None:
    #    current_location = query[0]['location']
    else:
        tmp = list()
        for i in in_out_events:
            if i[0] == id: # and (time_start is None or i[1] > time_start):
                if i[2]:
                    event = 'in'
                else:
                    event = 'out'
                tmp.append(f'{event} станок № {i[3]}')

        tmp.reverse()  # сортировка по времени, чтобы выше было актуальное время.
        current_location = tmp[0]
    result = {'batch_id': id, 'current_location': current_location, 'events': query}
    return result


"""
#Протестировал, всё работает.
a = create_report_on_batch_by_filters(1, None, None)
b = create_report_on_batch_by_filters(2, None, None)
c = create_report_on_batch_by_filters(3, None, None)

d = create_report_on_batch_by_filters(1, time + timedelta(minutes=35), None)
e = create_report_on_batch_by_filters(1, time, time + timedelta(minutes=35))

j = 1
"""