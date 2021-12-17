from datetime import datetime, timedelta

from test_data.python_data import in_out_events


def create_report_on_batch_by_filters(id):
    query = list()

    for i in range(0, len(in_out_events)):
        if in_out_events[i][0] == id:
            if in_out_events[i][2]:
                time_in = str(in_out_events[i][1])
                time_out = None
                if i + 1 < len(in_out_events) and not in_out_events[i + 1][2]:
                    time_out = str(in_out_events[i + 1][1])
                query.append({'zone_id': in_out_events[i][3], 'time_in': time_in, 'time_out': time_out})


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
