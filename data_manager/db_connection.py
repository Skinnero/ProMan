from os import environ
from psycopg2 import connect, DatabaseError
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

# Loads data form .env file
load_dotenv()

def establish_connection():
    """Creates a connection with db and return cursor(RealDictCursor)

    Returns:
        connect.cursor: RealDictCursor
    """    
    connection_data = get_connection_data()

    try:
        connect_str = "dbname={} user={} host={} password={}".format(
            connection_data['dbname'],
            connection_data['user'],
            connection_data['host'],
            connection_data['password']
        )
        conn = connect(connect_str)
        conn.autocommit = True
        return conn.cursor(cursor_factory=RealDictCursor)
    except DatabaseError as e:
        print("Cannot connect to database.")
        print(e)

def get_connection_data():
    """Gets db data from environment variables (.env file)

    Returns:
        dict: dict with db data !NECESSERY!
    """    
    return {
        'dbname': environ.get('MY_PSQL_DBNAME'),
        'user': environ.get('MY_PSQL_USER'),
        'host': environ.get('MY_PSQL_HOST'),
        'password': environ.get('MY_PSQL_PASSWORD')
    }

CURSOR = establish_connection()