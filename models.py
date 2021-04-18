from flask import Flask, session
from app import *
from marshmallow import fields
from flask_jwt_extended import create_access_token
from datetime import timedelta
from flask_bcrypt import Bcrypt

editableTables = ['EnterpriseDB', 'DepartmentDB', 'LocationsDB', 'GatesDB', 'AnchorsDB', 'ZonesDB', 'EquipmentDB', 'TagsDB', 'MarksDB', 'SpecDB', 'OrdersDB', 'TechDB', 'UsersDB']

class PermissionsDB(db.Model):
    __tablename__ = 'userPermissions'
    id_permission= db.Column(db.Integer(), primary_key=True, autoincrement=True)
    table = db.Column(db.Text())
    role = db.Column(db.Text())
    get = db.Column(db.Boolean())
    put = db.Column(db.Boolean())
    delete = db.Column(db.Boolean())

class RolesDB(db.Model):
    __tablename__ = 'userRoles'
    id_role= db.Column(db.Integer(), primary_key=True, autoincrement=True)
    role = db.Column(db.Text(), unique=True)

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
    anchors = db.relationship("AnchorsDB", backref=db.backref('locations'), lazy=True)
    zones = db.relationship("ZonesDB", backref=db.backref('locations'), lazy=True)
    equipment = db.relationship("EquipmentDB", backref=db.backref('locations'), lazy=True)

class GatesDB(db.Model):
    __tablename__ = 'gates'
    id_gate = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    mac = db.Column(db.Text())
    created = db.Column(db.DateTime())    
    gain = db.Column(db.Float()) 
    anchor = db.relationship("AnchorsDB", backref=db.backref('gates'), lazy=True)

class AnchorsDB(db.Model):
    __tablename__ = 'anchors'
    id_anchor = db.Column(db.Integer, primary_key=True, autoincrement=True)
    mac = db.Column(db.String(250))
    gain = db.Column(db.Float())
    id_location = db.Column(db.Integer, db.ForeignKey('locations.id_location'))
    name = db.Column(db.String(500))
    x_pos = db.Column(db.Float)
    y_pos = db.Column(db.Float)
    id_gate = db.Column(db.Integer, db.ForeignKey('gates.id_gate'))
    zones = db.relationship("ZonesDB", backref=db.backref('anchors'), lazy=True)
    
class ZonesDB(db.Model):
    __tablename__ = 'zones'
    id_zone = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    id_location = db.Column(db.Integer, db.ForeignKey('locations.id_location'))
    created = db.Column(db.DateTime())
    modified = db.Column(db.DateTime())
    name = db.Column(db.Text())
    points = db.Column(db.Text())
    weight = db.Column(db.Float())
    sharp = db.Column(db.Float())
    type = db.Column(db.Integer)
    equipment_id = db.Column(db.Integer)
    id_anchor = db.Column(db.Integer, db.ForeignKey('anchors.id_anchor'))
    threshold_in = db.Column(db.Integer)
    threshold_out = db.Column(db.Integer)
    equipment = db.relationship("EquipmentDB", backref=db.backref('zones'), lazy=True)
    
class EquipmentDB(db.Model):
    __tablename__ = 'equipment'
    equipment_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    id_location = db.Column(db.Integer, db.ForeignKey('locations.id_location'))
    id_zone = db.Column(db.Integer, db.ForeignKey('zones.id_zone'))
    equipment_model = db.Column(db.Text())
    equipment_type = db.Column(db.Text())
    equipment_name = db.Column(db.Text())
    created = db.Column(db.DateTime(), unique=True)

class TagsDB(db.Model):
    __tablename__ = 'tags'
    id_tag = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    uuid = db.Column(db.Text())
    mac = db.Column(db.Text())
    created = db.Column(db.DateTime())
    tag_gain = db.Column(db.Integer)
    marks = db.relationship("MarksDB", backref=db.backref('tags'), lazy=True)

class MarksDB(db.Model):
    __tablename__ = 'markers'
    id_mark = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    id_tag = db.Column(db.Integer, db.ForeignKey('tags.id_tag'))
    created = db.Column(db.DateTime())
    modified = db.Column(db.DateTime())
    name = db.Column(db.Text())
    
class SpecDB(db.Model):
    __tablename__ = 'spec'
    id_spec = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    code = db.Column(db.Integer())
    name = db.Column(db.Text())

class TechDB(db.Model):
    __tablename__ = 'technology'
    id_techop = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    id_spec = db.Column(db.Integer())
    code = db.Column(db.Integer())
    name = db.Column(db.Text())
    equipment_id = db.Column(db.Integer, db.ForeignKey('equipment.equipment_id')) 
    nop = db.Column(db.Integer())

class OrdersDB(db.Model):
    __tablename__ = 'orders'
    id_order = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    order_num = db.Column(db.Integer())
    order_name = db.Column(db.Text())
    customer = db.Column(db.Text())
    code_spec = db.Column(db.Integer, db.ForeignKey('spec.id_spec')) 
    product_name = db.Column(db.Text())
    created = db.Column(db.DateTime())
    started = db.Column(db.DateTime())
    closed = db.Column(db.DateTime())

class TestDB(db.Model):
    __tablename__ = 'tests'
    id_test = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    test_int = db.Column(db.Integer())

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

class MarkgroupDB(db.Model):
    __tablename__ = 'markgroup'
    markgroup_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    markgroup_name = db.Column(db.Text(), unique=True)

class MarkgroupSettingsDB(db.Model):
    __tablename__ = 'markgroupSetting'
    setting_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    markgroup_id = db.Column(db.Integer, db.ForeignKey('markgroup.markgroup_id')) 
    setting_name = db.Column(db.Text(), unique=True)
    setting_type = db.Column(db.Text())
    setting_script = db.Column(db.Text())
    setting_params = db.Column(db.Text())

class MarkgroupRelationsDB(db.Model):
    __tablename__ = 'markgroupRelations'
    markgroupTable_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    markers_id = db.Column(db.Integer, db.ForeignKey('markers.id_mark'), nullable=False)
    markgroup_id = db.Column(db.Integer, db.ForeignKey('markgroup.markgroup_id'), nullable=False) 


class EnterpriseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = EnterpriseDB
        include_fk = True
        
class DepartmentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = DepartmentDB
        include_fk = True
        
class LocationsSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = LocationsDB
        include_fk = True
       
class AnchorsSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = AnchorsDB
        include_fk = True
        
class GatesSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = GatesDB
        include_fk = True

class ZonesSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ZonesDB
        include_fk = True

class TagsSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = TagsDB
        include_fk = True

class MarksSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = MarksDB
        include_fk = True

class EquipmentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = EquipmentDB
        include_fk = True

class SpecSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = SpecDB
        include_fk = True

class TechSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = TechDB
        include_fk = True

class UsersSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = UsersDB
        include_fk = True

class PermissionsSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PermissionsDB
        include_fk = True

class RolesSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = RolesDB
        include_fk = True
        
class OrdersSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = OrdersDB
        include_fk = True

class MarkgroupSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = MarkgroupDB
        include_fk = True

class MarkgroupSettingsSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = MarkgroupSettingsDB
        include_fk = True

class MarkgroupRelationsSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = MarkgroupRelationsDB
        include_fk = True

