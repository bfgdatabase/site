
class Configuration(object):

    DEBUG = True
    USE_RELOADER = False
    
    '''
    POSTGRES_URL = "ironside.hopto.org:5432"
    POSTGRES_USER = "bfg"
    POSTGRES_PW = "bfgdatabase"
    POSTGRES_DB = "bfg"
    '''
    '''
    POSTGRES_URL = "127.0.0.1:5432"
    POSTGRES_USER = "timur"
    POSTGRES_PW = "123456"
    POSTGRES_DB = "bfg"
    '''

    POSTGRES_URL = "127.0.0.1:5432"
    POSTGRES_USER = "bfg"
    POSTGRES_PW = "123456"
    POSTGRES_DB = "new"
    
    SEKRET_KEY = "bfg-group"

    UPLOAD_FOLDER = 'static/images/maps'
    ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

    USER_PASSWORD_HASH             = 'bfg-bcrypt' 

    # email server
    MAIL_SERVER = 'smtp.yandex.ru'
    MAIL_PORT = 25
    MAIL_USE_SSL = False
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'bfgdatabase.server'
    MAIL_PASSWORD = 'cizktdbvizcpddnx'
