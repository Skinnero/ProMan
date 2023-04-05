from data_manager.db_connection import CURSOR
from psycopg2.errors import InvalidTextRepresentation, ForeignKeyViolation

def get_one_by_id(id:str):
    """Get card by it's id

    Args:
        id (str): card id
    Returns:
        dict: card values
    """    
    try:
        id = int(id)
        query = 'SELECT * FROM cards WHERE id = %s'
        CURSOR.execute(query, [id])
        return CURSOR.fetchone()
    except ValueError:
        return False

def get_by_column_id(data:dict):
    """Return all cards that belongs to the board

    Args:
        data (dict): card id

    Returns:
        list: list of cards value
    """    
    try:
        column_id = int(data['column_id'])
        query = 'SELECT * FROM cards WHERE column_id = %s'
        CURSOR.execute(query, [column_id])
        if CURSOR.rowcount == 0:
                raise ValueError
        return True, CURSOR.fetchall()
    except ValueError:
        return False, 'ValueError: Passed wrong value'
    except KeyError:
        return False,'KeyError: Passed wrong key'

def add(data:dict):
    """Inserts new card into the table

    Args:
        data (dict): dict with key 'name' and 'column_id'
    """
    try:
        data = [data['message'], data['column_id']]
        query = 'INSERT INTO cards(message, column_id) VALUES (%s, %s)'
        CURSOR.execute(query, data)
        return True, 'Card created successfully'
    except (ForeignKeyViolation, InvalidTextRepresentation):
        return False, 'InvalidTextRepresentation or ForeignKeyViolation: Passed wrong value'
    except KeyError:
        return False,'KeyError: Passed wrong key'
    
def delete_by_id(data:dict):
    """Deletes card by id

    Args:
        data (dict): dict with card's id

    Returns:
        bool: true if succesful otherwise false
    """    
    try:
        id = int(data['id'])
        query = 'DELETE FROM cards where id = %s'
        CURSOR.execute(query, [id])
        if CURSOR.rowcount == 0:
            raise ValueError
        return True, 'Card deleted successfully'
    except ValueError:
        return False, 'ValueError: Passed wrong value'
    except KeyError:
        return False,'KeyError: Passed wrong key'

def change_message_by_id(data:dict):
    """Updates card by it's id

    Args:
        data (dict): dict with key 'id'

    Returns:
        bool: true if succesful otherwise false
    """    
    try:
        id = int(data['id'])
        data = [data['message'], id]
        query = 'UPDATE cards SET message = %s WHERE id = %s'
        CURSOR.execute(query, data)
        if CURSOR.rowcount == 0:
            raise ValueError
        return True, 'Column updated successfully'
    except ValueError:
        return False, 'ValueError: Passed wrong value'
    except KeyError:
        return False,'KeyError: Passed wrong key'

  