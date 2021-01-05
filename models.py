from app import db
from app import ma
from marshmallow import fields

class EnterpriseDB(db.Model):
    __tablename__ = 'enterprise'
    id = db.Column(db.Integer(), primary_key=True)
    ent_name = db.Column(db.Text())
    department = db.relationship("DepartmentDB", backref=db.backref('enterprise'), lazy=True)

class DepartmentDB(db.Model):
    __tablename__ = 'department'
    dept_id = db.Column(db.Integer(), primary_key=True)
    ent_id = db.Column(db.Integer, db.ForeignKey('enterprise.id'))
    dept_name = db.Column(db.Text())
    locations = db.relationship("LocationsDB", backref=db.backref('department'), lazy=True)

class LocationsDB(db.Model):
    __tablename__ = 'locations'
    id_location = db.Column(db.Integer(), primary_key=True)
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
    id_gate = db.Column(db.Integer(), primary_key=True)
    mac = db.Column(db.Text())
    created = db.Column(db.DateTime())    
    gain = db.Column(db.Float()) 
    anchor = db.relationship("AnchorsDB", backref=db.backref('gates'), lazy=True)


class AnchorsDB(db.Model):
    __tablename__ = 'anchors'
    id_anchor = db.Column(db.Integer, primary_key=True)
    mac = db.Column(db.String(250))
    gain = db.Column(db.Float())
    id_location = db.Column(db.Integer, db.ForeignKey('locations.id_location'))
    name = db.Column(db.String(500))
    x_pos = db.Column(db.Float)
    y_pos = db.Column(db.Float)
    id_gate = db.Column(db.Integer, db.ForeignKey('gates.id_gate'))
    zones = db.relationship("ZonesDB", backref=db.backref('anchors'), lazy=True)
    

class TstDB(db.Model):
    __tablename__ = 'tst'
    id_anchor = db.Column(db.Integer, primary_key=True)
    mac = db.Column(db.String(250))
    gain = db.Column(db.Float)
    name = db.Column(db.String(500))
    x_pos = db.Column(db.Float)
    y_pos = db.Column(db.Float)
    id_location = db.Column(db.Integer, db.ForeignKey('locations.id_location'))
    id_gate = db.Column(db.Integer, db.ForeignKey('gates.id_gate'))

class Video(db.Model):
    __tablename__ = 'videos'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    name = db.Column(db.String(250), nullable=False)
    description = db.Column(db.String(500), nullable=False)


class ZonesDB(db.Model):
    __tablename__ = 'zones'
    id_zone = db.Column(db.Integer(), primary_key=True)
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
    equipment_id = db.Column(db.Integer(), primary_key=True)
    id_location = db.Column(db.Integer, db.ForeignKey('locations.id_location'))
    id_zone = db.Column(db.Integer, db.ForeignKey('zones.id_zone'))
    equipment_model = db.Column(db.Text())
    equipment_type = db.Column(db.Text())
    equipment_name = db.Column(db.Text())
    created = db.Column(db.DateTime())
    modified = db.Column(db.DateTime())
    tech = db.relationship("TechDB", backref=db.backref('equipment'), lazy=True)

class TagsDB(db.Model):
    __tablename__ = 'tags'
    id_tag = db.Column(db.Integer(), primary_key=True)
    uuid = db.Column(db.Text())
    mac = db.Column(db.Text())
    created = db.Column(db.DateTime())
    tag_gain = db.Column(db.Integer)
    marks = db.relationship("MarksDB", backref=db.backref('tags'), lazy=True)

class MarksDB(db.Model):
    __tablename__ = 'markers'
    id_mark = db.Column(db.Integer(), primary_key=True)
    id_tag = db.Column(db.Integer, db.ForeignKey('tags.id_tag'))
    created = db.Column(db.DateTime())
    modified = db.Column(db.DateTime())
    name = db.Column(db.Text())
    
class SpecDB(db.Model):
    __tablename__ = 'spec'
    id_spec = db.Column(db.Integer(), primary_key=True)
    code = db.Column(db.Integer())
    name = db.Column(db.Text())

class TechDB(db.Model):
    __tablename__ = 'technology'
    id_techop = db.Column(db.Integer(), primary_key=True)
    id_spec = db.Column(db.Integer())
    code = db.Column(db.Integer())
    name = db.Column(db.Text())
    equipment_id = db.Column(db.Integer, db.ForeignKey('equipment.equipment_id')) 
    nop = db.Column(db.Integer())

class UsersDB(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.Text())
    username = db.Column(db.Text(), unique=True)
    email = db.Column(db.Text(), unique=True)
    password_hash = db.Column(db.Text(), unique=True)
    created = db.Column(db.DateTime())
    updated = db.Column(db.DateTime())
    phone = db.Column(db.Text())
    role = db.Column(db.Text())
    info = db.Column(db.Text())

class EnterpriseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = EnterpriseDB
        include_fk = True
        include_relationships = True
        
class DepartmentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = DepartmentDB
        include_fk = True
        include_relationships = True
        
class LocationsSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = LocationsDB
        include_fk = True
        include_relationships = True
       
class AnchorsSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = AnchorsDB
        include_fk = True
        
class GatesSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = GatesDB
        include_fk = True
        include_relationships = True

class ZonesSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ZonesDB
        include_fk = True
        include_relationships = True

class TagsSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = TagsDB
        include_fk = True
        include_relationships = True

class MarksSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = MarksDB
        include_fk = True
        include_relationships = True

class EquipmentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = EquipmentDB
        include_fk = True
        include_relationships = True

class SpecSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = SpecDB
        include_fk = True
        include_relationships = True

class TechSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = TechDB
        include_fk = True
        include_relationships = True

class UsersSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = UsersDB
        include_fk = True
        include_relationships = True
        

class VideoSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Video
        include_fk = True

class TstSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model =TstDB
        include_fk = True

