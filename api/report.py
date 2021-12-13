from flask_apispec import marshal_with, doc

from AlexeyService.reports.batch import create_report_on_batch_by_filters
from app import *
from test_data.python_data import analytics
from utils import responses as resp
from utils.responses import response_with


@app.route('/api/report/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Отчёт о местоположении партии и её последних перемещениях.', tags=['report'])
@resp.check_user_permission(dbName="BatchDB", method='GET')
def get_report_batch_movement(id):
    query = create_report_on_batch_by_filters(id)
    # {
    # 'batch_id',
    # 'current_location',
    # 'events' : [ {'time', 'location'} ]
    # }
    #
    return response_with(resp.SUCCESS_200, value={"query": json.dumps(query)})


docs.register(get_report_batch_movement)

@app.route('/api/analytics/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Получить аналитику по партии.', tags=['report'])
@resp.check_user_permission(dbName="BatchDB", method='POST')
def get_analytics(id):
    query = analytics[id-1]
    return response_with(resp.SUCCESS_200, value={"query": json.dumps(query)})


docs.register(get_analytics)
