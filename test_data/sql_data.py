from models import *
from datetime import datetime, timedelta

time = datetime.now()

order1 = OrdersDB(
    order_num=1,
    order_name='Крепёж',
    customer='ООО Гвоздь',
    spec_id=1,
    product_name='Крепёж',
    created=time,
    started=time,
    closed=time + timedelta(days=10),
    status='В работе',
)
db.session.add(order1)

db.session.commit()
