from os import environ
from psycopg2 import connect, DatabaseError
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()


def establish_connection(connection_data=None):
    """
    Create a database connection based on the :connection_data: parameter
    :connection_data: Connection string attributes
    :returns: psycopg2.connection
    """
    if connection_data is None:
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


def get_connection_data(db_name:str = None):
    """
    Give back a properly formatted dictionary based on the environment variables values which are started
    with :MY__PSQL_: prefix
    :db_name: optional parameter. By default, it uses the environment variable value.
    """
    if db_name is None:
        db_name = environ.get('MY_PSQL_DBNAME')

    return {
        'dbname': db_name,
        'user': environ.get('MY_PSQL_USER'),
        'host': environ.get('MY_PSQL_HOST'),
        'password': environ.get('MY_PSQL_PASSWORD')
    }


CURSOR = establish_connection()
