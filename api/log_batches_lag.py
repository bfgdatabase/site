from flask_apispec import doc

from models import *
from utils import responses as resp
from utils.responses import response_with


@app.route('/api/log_batches_lag/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get all log_batches_lag', tags=['LogBatchesLag'])
@resp.check_user_permission(dbName="LogBatchesLagDB", method='GET')
def get_log_batches_lag():
    query = LogBatchesLagDB.query.all()
    query_schema = LogBatchesLagSchema(many=True)
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})


docs.register(get_log_batches_lag)


@app.route('/api/log_batches_lag/<int:id>/', methods=['GET'], provide_automatic_options=False)
@doc(description='Get log_batches_lag by batch_id', tags=['LogBatchesLag'])
@resp.check_user_permission(dbName="LogBatchesLagDB", method='GET')
def get_log_batches_lag_by_batch_id(id):
    query = LogBatchesLagDB.query.filter(LogBatchesLagDB.batch_id == id).order_by('time').all()
    query_schema = LogBatchesLagSchema()
    return response_with(resp.SUCCESS_200, value={"query": query_schema.dump(query)})


docs.register(get_log_batches_lag_by_batch_id)
