from flask import Flask, session
from sqlalchemy import Index

from app import *
from marshmallow import fields
from flask_jwt_extended import create_access_token
from datetime import timedelta
from flask_bcrypt import Bcrypt
from sqlalchemy.dialects.postgresql import ARRAY

class TnotchDB(db.Model):
    __tablename__ = 'tnotch'
    tnotch_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    nametypenotch = db.Column(db.Text())

class SetnotchDB(db.Model):
    __tablename__ = 'setnotch'
    setnotch_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    name_setnotch = db.Column(db.Text())

class TmetricDB(db.Model):
    __tablename__ = 'tmetric'
    tmetric_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    nametmetric = db.Column(db.Text())

'''
class acts(db.Model):
    act = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    actname = db.Column(db.Text())

class report(db.Model):
    id_report = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    reportname = db.Column(db.Text())

class reportpart(db.Model):
    id_reportpart = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    id_report = db.Column(db.Integer()) # [ref: > report.id_report]
    partname = db.Column(db.Text())  
    field = db.Column(db.Text())
    applay = db.Column(db.Text())
'''
  
class BatchDB(db.Model):
    __tablename__ = 'batch'
    batch_id = db.Column(db.Integer(), primary_key=True, autoincrement=True) 
    code = db.Column(db.Integer, db.ForeignKey('spec.code')) # [ref: > spec.code]
    created_at = db.Column(db.Text())
    id_mark = db.Column(db.Integer, db.ForeignKey('markers.id_mark'))  #[ref: > markers.id_mark]
    batch_size = db.Column(db.Float()) 
    detail_name = db.Column(db.Text())
    product_name = db.Column(db.Text())
    batchnum = db.Column(db.Text())  
    parentnum = db.Column(db.Text())
    order_id  = db.Column(db.Integer()) 
    created = db.Column(db.Text())
    closed = db.Column(db.Text())
    route_id = db.Column(db.Integer, db.ForeignKey('route.route_id')) # [ref: > route.route_id]
    
class BatchlocDB(db.Model):
    __tablename__ = 'batchloc'
    batchloc_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    batch_id = db.Column(db.Integer, db.ForeignKey('batch.batch_id')) #[ref: > batch.batch_id]
    route_id = db.Column(db.Integer, db.ForeignKey('route.route_id'))  #[ref: > route.route_id]
    timeis = db.Column(db.Text())
    tech_id = db.Column(db.Integer, db.ForeignKey('technology.tech_id'))# [ref: > techology.tech_id]
    t_notch = db.Column(db.Integer, db.ForeignKey('notch.t_notch'))  #[ref: > notch.t_notch]
    batch_size = db.Column(db.Float()) 
    nop = db.Column(db.Integer()) 
    active = db.Column(db.Boolean()) 

class MarklocDB(db.Model):
    __tablename__ = 'markloc'
    markloc_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    id_mark = db.Column(db.Integer, db.ForeignKey('markers.id_mark')) #[ref:> markers.id_mark]
    timeis = db.Column(db.DateTime())
    equipment_id = db.Column(db.Integer, db.ForeignKey('equipment.equipment_id')) #[ref: > equipment.equipment_id]
    t_notch = db.Column(db.Integer, db.ForeignKey('notch.t_notch')) #[ref: > notch.t_notch]
    arcive = db.Column(db.Boolean()) 

class MarklogDB(db.Model):
    __tablename__ = 'marklog'
    marklog_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    id_location = db.Column(db.Integer, db.ForeignKey('locations.id_location'))
    id_mark = db.Column(db.Integer, db.ForeignKey('markers.id_mark'))   #[ref:> markers.id_mark]
    pos_x = db.Column(db.Float())  
    pos_y = db.Column(db.Float()) 
    timeis = db.Column(db.Text())

class OrdersDB(db.Model):
    __tablename__ = 'orders'
    order_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    order_num = db.Column(db.Integer())
    order_name = db.Column(db.Text())
    customer = db.Column(db.Text())
    spec_id = db.Column(db.Integer, db.ForeignKey('spec.spec_id')) 
    product_name = db.Column(db.Text())
    created = db.Column(db.DateTime())
    started = db.Column(db.DateTime())
    closed = db.Column(db.DateTime())
    status = db.Column(db.Text())

'''
class orders_codes(db.Model):
    orders_codes_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer()) # [ref: > orders.order_id]
    code = db.Column(db.Text()) #[ref:> spec.code]
    product_name = db.Column(db.Text())
    amount = db.Column(db.Float()) 
'''
    
class SpecDB(db.Model):
    __tablename__ = 'spec'
    spec_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    code = db.Column(db.Text())
    name = db.Column(db.Text())
    detailname = db.Column(db.Text())
    parent_code = db.Column(db.Text())
    parent_name = db.Column(db.Text())
    amount = db.Column(db.Integer()) 
    identity = db.Column(db.Text())
    parent_identity = db.Column(db.Text()) 

class RouteDB(db.Model):
    __tablename__ = 'route'
    route_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    name = db.Column(db.Text())
    type = db.Column(db.Text()) 
    spec_id = db.Column(db.Integer, db.ForeignKey('spec.spec_id')) 

class TechDB(db.Model):
    __tablename__ = 'technology'
    tech_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    route_id = db.Column(db.Integer, db.ForeignKey('route.route_id'))   #[ref:> route.route_id]
    name = db.Column(db.Text())
    code = db.Column(db.Integer())
    nop = db.Column(db.Integer()) 
    equipment_id = db.Column(db.Integer, db.ForeignKey('equipment.equipment_id')) 
    t_nal = db.Column(db.Float()) 
    t_pz = db.Column(db.Float()) 
    t_sht = db.Column(db.Float()) 
    first_zone_id = db.Column(db.Integer, db.ForeignKey('zones.id_zone'))  
    first_zone_type = db.Column(db.Text()) 
    second_zone_id = db.Column(db.Integer, db.ForeignKey('zones.id_zone'))  
    second_zone_type = db.Column(db.Text()) 

class BatchpauseDB(db.Model):
    __tablename__ = 'batchpause'
    batchpause_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    batch_id = db.Column(db.Integer, db.ForeignKey('batch.batch_id')) # [ref: > batch.batch_id]
    beginpause = db.Column(db.Text())
    endpause = db.Column(db.Text())

class RmetricDB(db.Model):
    __tablename__ = 'rmetric'
    rmetric_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    metricname = db.Column(db.Text())
    route_id = db.Column(db.Integer, db.ForeignKey('route.route_id'))  #[ref: > route.route_id] //какому маршруту принадлежат
    t_metric = db.Column(db.Integer, db.ForeignKey('tmetric.tmetric_id'))  #[ref: > tmetric.t_metric]
    tech_ida = db.Column(db.Integer, db.ForeignKey('techology.tech_id')) # [ref: > techology.tech_id]
    t_notcha = db.Column(db.Integer, db.ForeignKey('notch.t_notch')) # [ref: > notch.t_notch]
    tech_idb = db.Column(db.Integer, db.ForeignKey('technology.tech_id'))  #[ref: > techology.tech_id]
    t_notchb = db.Column(db.Integer, db.ForeignKey('notch.t_notch')) # [ref: > notch.t_notch]
    norma = db.Column(db.Integer())   

class BmetricDB(db.Model):
    __tablename__ = 'bmetric'
    bmetric_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    rmetric_id = db.Column(db.Integer, db.ForeignKey('rmetric.rmetric_id')) #[ref:> rmetric.rmetric_id]
    batch_id = db.Column(db.Integer, db.ForeignKey('batch.batch_id'))  #[ref: > batch.batch_id]    
    route_id = db.Column(db.Integer, db.ForeignKey('route.route_id'))  #[ref: > route.route_id] //какому маршруту принадлежат
    t_metric = db.Column(db.Integer, db.ForeignKey('tmetric.tmetric_id'))  #[ref: > tmetric.t_metric]
    tech_ida = db.Column(db.Integer, db.ForeignKey('techology.tech_id')) # [ref: > techology.tech_id]
    t_notcha = db.Column(db.Integer, db.ForeignKey('notch.t_notch')) # [ref: > notch.t_notch]
    tech_idb = db.Column(db.Integer, db.ForeignKey('technology.tech_id'))  #[ref: > techology.tech_id]
    t_notchb = db.Column(db.Integer, db.ForeignKey('notch.t_notch')) # [ref: > notch.t_notch]
    norma = db.Column(db.Integer())   #erval
    value = db.Column(db.Integer())   #erval
    metricname = db.Column(db.Text())


'''
/home/timur/.local/lib/python3.8/site-packages/marshmallow_sqlalchemy/convert.py:134: 
SAWarning: relationship 'ZonesDB.locations' will copy column locations.id_location to column zones.id_location,

 which conflicts with relationship(s): 'ZonesDB.location' 
 (copies locations.id_location to zones.id_location). 
 If this is not the intention, consider if these relationships should be linked with back_populates, 
 or if viewonly=True should be applied to one or more if they are read-only. 
 For the less common case that foreign key constraints are partially overlapping, the orm.foreign() 
 annotation can be used to isolate the columns that should be written towards.   
 To silence this warning, add the parameter 'overlaps="location"' to the 'ZonesDB.locations' relationship.
  for prop in model.__mapper__.iterate_properties:
'''

class EquipmentDB(db.Model):
    __tablename__ = 'equipment'
    equipment_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    id_location = db.Column(db.Integer, db.ForeignKey('locations.id_location'))   
    equipment_name = db.Column(db.Text())
    equipment_model = db.Column(db.Text())
    equipment_type = db.Column(db.Text())
    zones = db.relationship("ZonesDB")
    

class ZonesDB(db.Model):
    __tablename__ = 'zones'
    id_zone = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    id_location = db.Column(db.Integer, db.ForeignKey('locations.id_location'))
    equipment_id = db.Column(db.Integer, db.ForeignKey('equipment.equipment_id'))
    tzone = db.Column(db.Integer, db.ForeignKey('tzones.tzone')) # [ref: > tzones.tzone]
    created = db.Column(db.DateTime())
    modified = db.Column(db.DateTime())
    name = db.Column(db.Text())
    points = db.Column(db.Text())
    weight = db.Column(db.Float())
    sharp = db.Column(db.Float())
    type = db.Column(db.Integer)
    threshold_in = db.Column(db.Integer)
    threshold_out = db.Column(db.Integer)
    
    # equipment_id = db.Column(db.Integer, db.ForeignKey('equipment.equipment_id'))
    # equipment_ = db.relationship("equipment", back_populates="children")
    # equipment = db.relationship("equipment", back_populates="zones")



class LocationsDB(db.Model):
    __tablename__ = 'locations'
    id_location = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    name = db.Column(db.Text())
    map = db.Column(db.Text())
    longitude = db.Column(db.Float())
    latitude = db.Column(db.Float())
    zero_x = db.Column(db.Float())
    zero_y = db.Column(db.Float())
    width = db.Column(db.Float())
    length = db.Column(db.Float())
    rotation = db.Column(db.Float())
    dept_id = db.Column(db.Integer, db.ForeignKey('department.dept_id'))
    imageurl= db.Column(db.Text())

    '''
    marklogs = db.relationship("MarklogDB", backref=db.backref('locations'), lazy=True)
    anchors = db.relationship("AnchorsDB", backref=db.backref('locations'), lazy=True)
    zones = db.relationship("ZonesDB", backref=db.backref('locations'), lazy=True)
    equipment = db.relationship("EquipmentDB", backref=db.backref('locations'), lazy=True)
    '''

class AnchorsDB(db.Model):
    __tablename__ = 'anchors'
    id_anchor = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    mac = db.Column(db.Text())
    id_location = db.Column(db.Integer, db.ForeignKey('locations.id_location'))
    gate_id = db.Column(db.Integer, db.ForeignKey('gates.gate_id'))    
    gain = db.Column(db.Float()) 
    name = db.Column(db.Text())
    x_pos = db.Column(db.Float()) 
    y_pos = db.Column(db.Float()) 
    z_pos = db.Column(db.Float()) 
    created = db.Column(db.Text())
    modified = db.Column(db.Text())

    '''
    zones = db.relationship("ZonesDB", backref=db.backref('anchors'), lazy=True)
    '''

class NotchDB(db.Model):
    __tablename__ = 'notch'
    notch_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    t_notch = db.Column(db.Integer, db.ForeignKey('zones.id_zone'))      #[ref: > tnotch.t_notch]
    setnotch_id = db.Column(db.Integer, db.ForeignKey('zones.id_zone'))      #[ref: > setnotch.setnotch]
    act = db.Column(db.Integer, db.ForeignKey('zones.id_zone'))      #[ref: > acts.act]
    equipment_id = db.Column(db.Integer, db.ForeignKey('zones.id_zone'))      #[ref: > equipment.equipment_id]
    namenotch = db.Column(db.Text())
    fol = db.Column(db.Text())

'''
class equipment_class(db.Model):
    equipment_class_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    equipment_class_name = db.Column(db.Text())
'''

class TzonesDB(db.Model):
    __tablename__ = 'tzones'
    tzone = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    nametzone = db.Column(db.Text())
    
class DepartmetsDB(db.Model):
    __tablename__ = 'departmets'
    dept_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    deptname = db.Column(db.Text())

class MarkersDB(db.Model):
    __tablename__ = 'markers'
    id_mark = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.tag_id'))
    markgroup_id = db.Column(db.Integer, db.ForeignKey('markGroup.markgroup_id')) 
    name = db.Column(db.Text())
    mac = db.Column(db.Text())
    uuid = db.Column(db.Text()) 

class MarkGroupDB(db.Model):
    __tablename__ = 'markGroup'
    markgroup_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    markgroup_name = db.Column(db.Text(), unique=True)
     
class MarkSettingsDB(db.Model):
    __tablename__ = 'markSettings'
    setting_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    markgroup_id = db.Column(db.Integer, db.ForeignKey('markGroup.markgroup_id'))
    setting_name = db.Column(db.Text())
    setting_type = db.Column(db.Text())
    setting_script = db.Column(db.Text())
    setting_params = db.Column(db.Text())
 
class TaglogDB(db.Model):
    __tablename__ = 'taglog'
    tag_idlog = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.tag_id'))      #[ref: > tags.tag_id]
    gate_id = db.Column(db.Integer, db.ForeignKey('gates.gate_id'))     # [ref: > gates.gate_id]
    rx_power = db.Column(db.Integer()) 
    rx_time = db.Column(db.Text())
    cnt = db.Column(db.Integer()) 
    tx_power = db.Column(db.Integer()) 
    exttype = db.Column(db.Integer()) 
    extdata = db.Column(db.Integer()) 
    band = db.Column(db.Integer()) 
    rawdata = db.Column(db.Text())

class TagsDB(db.Model):
    __tablename__ = 'tags'
    tag_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    mac = db.Column(db.Text())
    uuid = db.Column(db.Text())
    tag_gain = db.Column(db.Float()) 
    created = db.Column(db.Text())
    id_mark = db.Column(db.Integer, db.ForeignKey('markers.id_mark'))     # [ref: > markers.id_mark]

class GatesDB(db.Model):
    __tablename__ = 'gates'
    gate_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    mac = db.Column(db.Text())
    uuid = db.Column(db.Text())
    gain = db.Column(db.Float()) 

class TelemetrDB(db.Model):
    __tablename__ = 'telemetr'
    telemetr_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    timeis = db.Column(db.Text())
    id_mark = db.Column(db.Integer, db.ForeignKey('markers.id_mark'))      #[ref: > markers.id_mark]
    id_location = db.Column(db.Integer, db.ForeignKey('location.id_location'))      #[ref: > location.id_location]
    xpos = db.Column(db.Float()) 
    ypos = db.Column(db.Float()) 
    exttype = db.Column(db.Integer, db.ForeignKey('telecode.exttype'))     # [ref: > telecode.exttype]
    extdata = db.Column(db.Text()) 

class TelecodeDB(db.Model):
    __tablename__ = 'telecode'
    telecode_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    exttype = db.Column(db.Integer()) 
    decoder = db.Column(db.Text())
    archive = db.Column(db.Boolean()) 
    arcinterval = db.Column(db.Integer()) 
    trigger = db.Column(db.Text())
    event = db.Column(db.Text())
    eventparam = db.Column(db.Text())

class UserRolesDB(db.Model):
    __tablename__ = 'userRoles'
    role_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    role = db.Column(db.Text())

class UserPermissionsDB(db.Model):
    __tablename__ = 'userPermissions'
    permission_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    table = db.Column(db.Text())
    role = db.Column(db.Text())
    get = db.Column(db.Boolean()) 
    put = db.Column(db.Boolean()) 
    delete = db.Column(db.Boolean()) 

class EnterpriseDB(db.Model):
    __tablename__ = 'enterprise'
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    ent_name = db.Column(db.Text())
    department = db.relationship("DepartmentDB", backref=db.backref('enterprise'), lazy=True)

class DepartmentDB(db.Model):
    __tablename__ = 'department'
    dept_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    ent_id = db.Column(db.Integer, db.ForeignKey('enterprise.id'))
    dept_name = db.Column(db.Text())
    locations = db.relationship("LocationsDB", backref=db.backref('department'), lazy=True)
    
class UsersDB(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    login = db.Column(db.Text(), unique=True, nullable = False)
    username = db.Column(db.Text())
    email = db.Column(db.Text())
    password_hash = db.Column(db.Text(), nullable = False)
    phone = db.Column(db.Text())
    role = db.Column(db.Text())
    info = db.Column(db.Text())
    
    @classmethod
    def authentificate(cls, login, password):
        query = cls.query.filter_by(login = login)
        if((query.count()) == 0):
            return
        encoded_hash = query[0].password_hash
        if not (bcrypt.check_password_hash(encoded_hash, password)):
            return
        session["username"] = query[0].username
        session["login"] = query[0].login
        session["role"] = query[0].role
        return query[0]


class GroupDB(db.Model):
    """Группы.
    Группа - это таблица связей id метки c id правила.
    То есть, значения от данной метки, будут проверяться по указанным правилам."""
    __tablename__ = 'group'
    group_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    batch_id = db.Column(db.Integer, db.ForeignKey('batch.batch_id'))
    rule_id = db.Column(db.Integer, db.ForeignKey('rule.rule_id'))
    # group_batch_index = Index('group_batch_idx', batch_id)


class RuleDB(db.Model):
    """Правила для величин.
    Например,
    Вычислять среднюю температуру раз в 10 минут и если не в диапозоне 0 - 50, тогда ошибка."""
    __tablename__ = 'rule'
    rule_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    type_id = db.Column(db.Integer, db.ForeignKey('type.type_id'))
    periodicity = db.Column(db.DateTime())
    min = db.Column(db.Float())
    max = db.Column(db.Float())


class TypeDB(db.Model):
    """Тип величины.
    Название велчины и размерность.
    Например, Температура C."""
    __tablename__ = 'type'
    type_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    name = db.Column(db.Text())
    dimension = db.Column(db.Text())


class LogRulesDB(db.Model):
    """Журнал проверки величин.
    + count - количество проверенных величин.
    Например,
    11.11.2021 13:37 Температура 41, 50 значений.
    11.11.2021 13:47 Температура 39, 133 значения.
    11.11.2021 13:57 Температура 40, 4 значения.
    """
    __tablename__ = 'logrules'
    logrules_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    mark_id = db.Column(db.Integer, db.ForeignKey('markers.id_mark'))
    time = db.Column(db.DateTime())
    type_id = db.Column(db.Integer, db.ForeignKey('type.type_id'))
    value = db.Column(db.Float())
    count = db.Column(db.Integer())


class ErrorDB(db.Model):
    """Ошибка связанная с правилами и нормативами."""
    __tablename__ = 'errors'
    error_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    message = db.Column(db.Text())
    create_time = db.Column(db.DateTime())
    confirmed_time = db.Column(db.DateTime())
    status = db.Column(db.Boolean())
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))  
