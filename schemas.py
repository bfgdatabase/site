from app import *
from models import *

editableTables = ['TnotchDB',
'SetnotchDB',
'TmetricDB',
'BatchDB', 
'BatchlocDB', 
'MarklocDB', 
'MarklogDB',
'OrdersDB', 
'SpecDB',
'RouteDB', 
'TechDB',
'BatchpauseDB', 
'RmetricDB', 
'BmetricDB', 
'ZonesDB', 
'LocationsDB', 
'EquipmentDB', 
'AnchorsDB'
'NotchDB', 
'TzonesDB', 
'DepartmetsDB', 
'MarkersDB', 
'MarkGroupDB',
'MarkSettingsDB', 
'TaglogDB',
'TagsDB', 
'GatesDB', 
'TelemetrDB', 
'TelecodeDB', 
'UserRolesDB', 
'UserPermissionsDB', 
'EnterpriseDB'
'DepartmentDB', 
'UsersDB', 
'ErrorsDB', 
]

class BatchSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = BatchDB
        include_fk = True

class BatchpauseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = BatchpauseDB
        include_fk = True

class BatchlocSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = BatchlocDB
        include_fk = True

class MarklocSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = MarklocDB
        include_fk = True

class MarklogSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = MarklogDB
        include_fk = True

class BmetricSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = BmetricDB
        include_fk = True

class RmetricSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = RmetricDB
        include_fk = True

class NotchSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = NotchDB
        include_fk = True

class RouteSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = RouteDB
        include_fk = True

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
        model = MarkersDB
        include_fk = True

class EquipmentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = EquipmentDB
        include_fk = True
        include_relationships = True

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
        model = UserPermissionsDB
        include_fk = True

class RolesSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = UserRolesDB
        include_fk = True
        
class OrdersSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = OrdersDB
        include_fk = True

class OrdersEntriesSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = OrdersDB
        include_fk = True

class MarkGroupSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = MarkGroupDB
        include_fk = True

class MarkSettingSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = MarkSettingsDB
        include_fk = True

class TelemetrSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = TelemetrDB
        include_fk = True

class TelecodeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = TelecodeDB
        include_fk = True

class TnotchSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = TnotchDB
        include_fk = True

class SetnotchSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = SetnotchDB
        include_fk = True

class TmetricSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = TmetricDB
        include_fk = True

class MarkGroupSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = MarkGroupDB
        include_fk = True

class ErrorSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ErrorDB
        include_fk = True
