from datetime import datetime, timedelta

from test_data.python_data import in_out_events


def create_report_on_batch_by_filters(id):
    query = list()

    for i in in_out_events:
        if i[0] == id:  # and (time_start is None or i[1] >= time_start) and (time_end is None or i[1] <= time_end):
            if i[2]:
                event = 'in'
            else:
                event = 'out'
            query.append({'time': str(i[1]), 'event_type': event, 'zone_id': i[3]})

    query.reverse()  # сортировка по времени, чтобы выше было актуальное время.

    if len(query) == 0:
        return {
            'current_location_id': '',
            'current_zone_name': '',
            'events': list(),
        }
    result = {'current_location_id': 1, 'events': query}
    return result


"""
#Протестировал, всё работает.
a = create_report_on_batch_by_filters(1)
b = create_report_on_batch_by_filters(2)
c = create_report_on_batch_by_filters(3)

#d = create_report_on_batch_by_filters(1, time + timedelta(minutes=35), None)
#e = create_report_on_batch_by_filters(1, time, time + timedelta(minutes=35))

j = 1
"""
