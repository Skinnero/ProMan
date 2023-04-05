from data_manager.db_connection import CURSOR
from data_manager.columns import create_default_columns
from psycopg2.errors import InvalidTextRepresentation, ForeignKeyViolation

def get_one_by_id(id:str):
    """Get board by it's id

    Args:
        id (str): board id

    Returns:
        dict: board values
    """    
    try:
        id = int(id)
        query = 'SELECT * FROM boards WHERE id = %s'
        CURSOR.execute(query, [id])
        return CURSOR.fetchone()
    except ValueError:
        return False

def get_all():
    """Get all boards from DB

    Returns:
        list: list of dictionaries
    """    
    query = 'SELECT * FROM boards;'
    CURSOR.execute(query)
    return CURSOR.fetchall()

def delete_by_id(data:dict):
    """Deletes board by id

    Args:
        data (dict): dict with board's id

    Returns:
        bool: true if succesful otherwise false
    """    
    try:
        id = int(data['id'])
        query = 'DELETE FROM boards where id = %s'
        CURSOR.execute(query, [id])
        if CURSOR.rowcount == 0:
            raise ValueError
        return True, 'Board deleted successfully'
    except ValueError:
        return False , 'ValueError: Passed wrong value'
    except KeyError:
        return False, 'KeyError: Passed wrong key'

def add(data:dict):
    """Inserts new board into the table

    Args:
        data (dict): dict with key 'name' and 'user_id'
    """
    def get_most_recent():
        """Gets most recet added board

        Returns:
            dict: dict with most recent board values
        """        
        query = 'SELECT * FROM boards ORDER BY id DESC'
        CURSOR.execute(query)
        return CURSOR.fetchone() 
    
    try:
        data = [data['name'], data['user_id']]
        query = 'INSERT INTO boards(name, user_id) VALUES (%s, %s)'
        CURSOR.execute(query, data)
        create_default_columns(get_most_recent())
        return 'Board Created'
    
    except KeyError:
        return 'KeyError: Passed wrong key'
    
    except (ForeignKeyViolation, InvalidTextRepresentation):
        return 'InvalidTextRepresentation or ForeignKeyViolation: Passed wrong values'

def rename_by_id(data:dict):
    """Updates boards by it's id

    Args:
        data (dict): dict with key 'id'

    Returns:
        bool: true if succesful otherwise false
    """    
    try:
        id = int(data['id'])
        data = [data['name'], id]
        query = 'UPDATE boards SET name = %s WHERE id = %s'
        CURSOR.execute(query, data)
        if CURSOR.rowcount == 0:
            raise ValueError
        return True, 'Board updated successfully'
    except ValueError:
        return False, 'ValueError: Passed wrong value'
    except KeyError:
        return False, 'KeyError: Passed wrong key'
    
