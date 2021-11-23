from flask_apispec import marshal_with, doc

from AlexeyService.reports.batch import create_report_on_batch_by_filters
from app import *
from utils import responses as resp
from utils.responses import response_with


@app.route('/api/order/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get order by id', tags=['orders'])
@marshal_with(OrdersSchema())
@resp.check_user_permission(dbName = "OrdersDB", method = 'GET')
def get_report_batch(id, time_start=None, time_end=None):
    query = create_report_on_batch_by_filters(id, time_start, time_end)
    # {
    # 'batch_id',
    # 'current_location',
    # 'last_events' : [ {'time', 'location'} ]
    # }
    #
    return response_with(resp.SUCCESS_200, value=query)
docs.register(get_report_batch)





