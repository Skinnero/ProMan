from data_manager.db_connection import CURSOR
from data_manager.columns import create_default_columns
from psycopg2.errors import InvalidTextRepresentation, ForeignKeyViolation

def get_one(id:str):
    """Get board by it's id

    Args:
        id (str): board id from endpoint

    Returns:
        RealDictRow: dict with keys, {name, private, user_id}
    """    
    try:
        id = int(id)
        query = 'SELECT * FROM boards WHERE id = %s'
        CURSOR.execute(query, [id])
        return CURSOR.fetchone()
    except ValueError:
        return False

def get_all():
    """Gets all boards from DB

    Returns:
        list[RealDictRow]: list of dicts with boards values
    """    
    # time.sleep(0.2)
    query = 'SELECT * FROM boards ORDER BY id'
    CURSOR.execute(query)
    return CURSOR.fetchall()

def delete_by_id(id:str):
    """Deletes board by it's id

    Args:
        id (str): board id from endpoint

    Returns:
        bool + str: true if successfull else false, finally feedback
    """    
    try:
        id = int(id)
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
        data (dict): dict with keys, {name, user_id}
    """
    def get_most_recent_added():
        """Gets most recet added board

        Returns:
            RealDictRow : dict with most recent board values
        """        
        query = 'SELECT * FROM boards ORDER BY id DESC'
        CURSOR.execute(query)
        return CURSOR.fetchone() 
    try:
        data = [data['title']]
        query = 'INSERT INTO boards(title) VALUES (%s)'
        CURSOR.execute(query, data)
        create_default_columns(get_most_recent_added())
        return 'Board Created'
    
    except KeyError:
        return 'KeyError: Passed wrong key'
    
    except (ForeignKeyViolation, InvalidTextRepresentation):
        return 'InvalidTextRepresentation or ForeignKeyViolation: Passed wrong values'

def update_by_id(id:str, data:dict):
    """Updates boards by it's id

    Args:
        id (str): board id from endpoint
        data (dict): dict with key, {private or name}

    Returns:
        bool + str: true if successfull else false, finally feedback
    """    
    
    def set_private(id:str, data:dict):
        data = [data['private'], id]
        query = 'UPDATE boards SET private = %s WHERE id = %s'
        CURSOR.execute(query, data)

    def set_name(id:str, data:dict):
        data = [data['title'], id]
        query = 'UPDATE boards SET title = %s WHERE id = %s'
        CURSOR.execute(query, data)
    try:
        id = int(id)
        if 'title' in data.keys():
            set_name(id, data)
        elif 'private' in data.keys():
            set_private(id, data)
        else:
            return False, 'KeyError: Passed wrong key'
    except ValueError:
        return False, 'ValueError: Passed wrong value'
    return True, 'Board updated successfully'
