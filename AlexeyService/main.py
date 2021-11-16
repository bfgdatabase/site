import threading
from datetime import timedelta
import redis

from AlexeyService.telemetry.handler import run_telemetry_background_handler, run_rules_background_handler
from models import TypeDB, RuleDB
from AlexeyService.telemetry.socket import run_telemetry_socket

# Периодичность обработки оперативных данных телеметрии.
# TODO: Убрать заглушку, определять периодичность из правил.
timedelta_background_handler = timedelta(minutes=1)

redis_connection = redis.StrictRedis(host='localhost', port=6379, db=0)
types_list = TypeDB.query.all()
rules_list = RuleDB.query.all()
last_time_check_rules = dict()

threading.Thread(target=run_telemetry_socket).start()
threading.Thread(target=run_telemetry_background_handler).start()
threading.Thread(target=run_rules_background_handler).start()
