from data_manager.db_connection import CURSOR
from psycopg2.errors import UniqueViolation

def add(data:dict):
    """Inserts into db a new user

    Args:
        data (dict): dict with keys, {name, password}

    Returns:
        bool and str: true if succes else false, finally feedback
    """    
    try:
        data = [data['name'], data['password']]
        query = 'INSERT INTO users(name, password) VALUES (%s, %s)'
        CURSOR.execute(query, data)
        return True, 'User created successfully'
    except KeyError:
        return False, 'KeyError: Passed wrong key'
    except UniqueViolation:
        return False, 'UniqueViolation: User with this name already exist'
    
def get_by_name(name:str):
    """Gets user id and name and returns it

    Args:
        name (str): name of a user

    Returns:
        RealDictRow: dict with keys, {id, name}
    """    
    query = 'SELECT id, name FROM users where name = %s'
    CURSOR.execute(query, [name])
    return CURSOR.fetchone()

def get_password_by_name(name:str):
    """Gets user password and returns it

    Args:
        name (str): name of a user

    Returns:
        RealDictRow: dict with key, {password}
    """    
    query = 'SELECT password FROM users where name = %s'
    CURSOR.execute(query, [name])
    return CURSOR.fetchone()