import datetime
from time import sleep
import statistics

from AlexeyService.main import timedelta_background_handler, redis_connection, types_list, rules_list, \
    last_time_check_rules
from app import db
from models import LogRulesDB, ErrorDB, TypeDB


def run_telemetry_background_handler():
    """
    Запускает фоновый обработчик для телементрии.
    Его задача переодически брать оперативные данные, по каждой метке .
    Задача данные получить и положить в оперативные данные.
    """
    while True:
        try:
            for type_id in types_list:
                data = redis_connection.mget(type_id)
                redis_connection.delete(type_id)
                batches = dict()
                for i in data:
                    if i['batch_id'] in batches:
                        batches[i['batch_id']] = list()
                    batches[i['batch_id']].append(i['value'])

                # Обработать данные по правилам.
                for i in batches:
                    log = LogRulesDB()
                    log.mark_id = i
                    log.time = datetime.datetime.now()
                    log.value = statistics.mean(batches[i])
                    log.type_id = type_id
                    log.count = len(batches[i])
                    db.session.add(log)

                db.session.commit()

            sleep(timedelta_background_handler)
        except Exception as e:
            print(e)


def run_rules_background_handler():
    """
    Запускается фоновый обработчик правил.
    Есть время последней проверки значений по правилу.
    Если согласно правилу прошла дельта времени, то нужно из журнала взять последние записи и взять у них среднее.
    Если среднее удовлетворяет правилу, то всё хорошо, если не удовлетворяет, то ошибка.
    #TODO : добавить проверку нормативов времени.
    """
    while True:
        try:
            for rule in rules_list:
                if rule.rule_id not in last_time_check_rules:
                    last_time = datetime.datetime.now() - rule.time
                else:
                    last_time = last_time_check_rules[rule.rule_id]

                if datetime.datetime.now() - last_time > rule.periodicity:
                    data = LogRulesDB.query.filter(LogRulesDB.type_id == rule.type_id and
                                                   LogRulesDB.time > last_time
                                                   ).order_by(LogRulesDB.mark_id).all()

                    i = 0
                    while i < len(data):
                        sum = data[i].value
                        count = data[i].count
                        tmp = data[i].mark_id
                        i += 1
                        while i < len(data) and data[i].mark_id == tmp:
                            sum += data[i].value
                            count += data[i].count

                        avg = sum / count

                        if avg < rule.min or avg > rule.max:
                            # Ошибка.
                            err = ErrorDB()
                            now = datetime.datetime.now()
                            err.time = now
                            type_data = TypeDB.query.get(rule.type_id)
                            err.message = f'Ошибка по правилу: {type_data.name} должна принадлежать отрезку ' \
                                          f'[ {rule.min} ; {rule.max} ].\nID метки: {tmp},' \
                                          f' значение: {avg} {type_data.dimension}, время {now}.'
                            err.confirmed = False

                            db.session.add(err)
                            db.session.commit()

            sleep(timedelta_background_handler)
        except Exception as e:
            print(e)
