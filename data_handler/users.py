from data_handler.db_connection import CURSOR
from psycopg2.errors import UniqueViolation


def add(data: dict):

    try:
        data = [data['name'], data['password']]
        query = 'INSERT INTO users(name, password) VALUES (%s, %s)'
        CURSOR.execute(query, data)
        return True, 'User created successfully'
    except KeyError:
        return False, 'KeyError: Passed wrong key'
    except UniqueViolation:
        return False, 'UniqueViolation: User with this name already exist'


def get_by_name(name: str):

    query = 'SELECT id, name FROM users where name = %s'
    CURSOR.execute(query, [name])
    return CURSOR.fetchone()


def get_password_by_name(name: str):

    query = 'SELECT password FROM users where name = %s'
    CURSOR.execute(query, [name])
    return CURSOR.fetchone()
