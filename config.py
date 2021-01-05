
class Configuration(object):

    DEBUG = True
    '''
    POSTGRES_URL = "ironside.hopto.org:5432"
    POSTGRES_USER = "bfg"
    POSTGRES_PW = "bfgdatabase"
    POSTGRES_DB = "bfg"
    '''

    POSTGRES_URL = "127.0.0.1:5432"
    POSTGRES_USER = "timur"
    POSTGRES_PW = "123456"
    POSTGRES_DB = "bfg"
    
    SEKRET_KEY = "bfg-group"

    UPLOAD_FOLDER = 'static/images/maps'
    ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])


    USER_PASSWORD_HASH             = 'bfg-bcrypt' 
