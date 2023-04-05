from data_manager.db_connection import CURSOR
from psycopg2.errors import InvalidTextRepresentation, ForeignKeyViolation

def get_one_by_id(id:str):
    """Get column by it's id

    Args:
        id (str): column id
    Returns:
        dict: column values
    """    
    try:
        id = int(id)
        query = 'SELECT * FROM columns WHERE id = %s'
        CURSOR.execute(query, [id])
        return CURSOR.fetchone()
    except ValueError:
        return False

def create_default_columns(data:dict):
    """Creates default caolumns for new board

    Args:
        data (dict): board id
    """    
    board_id = data['id']
    query = f"""
    INSERT INTO columns(name, board_id) VALUES ('To do', {board_id});
    INSERT INTO columns(name, board_id) VALUES ('Additional', {board_id});
    INSERT INTO columns(name, board_id) VALUES ('Doing', {board_id});
    INSERT INTO columns(name, board_id) VALUES ('Done', {board_id});
    """
    CURSOR.execute(query)

def get_by_board_id(data:dict):
    """Return all columns that belongs to the board

    Args:
        data (dict): columns id

    Returns:
        list: list of columns value
    """    
    try:
        board_id = int(data['board_id'])
        query = 'SELECT * FROM columns WHERE board_id = %s'
        CURSOR.execute(query, [board_id])
        if CURSOR.rowcount == 0:
            raise ValueError
        return True, CURSOR.fetchall()
    except ValueError:
        return False, 'ValueError: Passed wrong value'
    except KeyError:
        return False,'KeyError: Passed wrong key'
    
def delete_by_id(data:dict):
    """Deletes column by id

    Args:
        data (dict): dict with columns's id

    Returns:
        bool: true if succesful otherwise false
    """    
    try:
        id = int(data['id'])
        query = 'DELETE FROM columns where id = %s'
        CURSOR.execute(query, [id])
        if CURSOR.rowcount == 0:
            raise ValueError
        return True, 'Column deleted successfully'
    except ValueError:
        return False, 'ValueError: Passed wrong value'
    except KeyError:
        return False,'KeyError: Passed wrong key'
    
def add(data:dict):
    """Inserts new column into the table

    Args:
        data (dict): dict with key 'name' and 'board_id'
    """
    try:
        data = [data['name'], data['board_id']]
        query = 'INSERT INTO columns(name, board_id) VALUES (%s, %s)'
        CURSOR.execute(query, data)
        return True, 'Column created successfully'
    except (ForeignKeyViolation, InvalidTextRepresentation):
        return False, 'InvalidTextRepresentation or ForeignKeyViolation: Passed wrong value'
    except KeyError:
        return False,'KeyError: Passed wrong key'

def rename_by_id(data:dict):
    """Updates columns by it's id

    Args:
        data (dict): dict with key 'id'

    Returns:
        bool: true if succesful otherwise false
    """    
    try:
        id = int(data['id'])
        data = [data['name'], id]
        query = 'UPDATE columns SET name = %s WHERE id = %s'
        CURSOR.execute(query, data)
        if CURSOR.rowcount == 0:
            raise ValueError
        return True, 'Column updated successfully'
    except ValueError:
        return False, 'ValueError: Passed wrong value'
    except KeyError:
        return False,'KeyError: Passed wrong key'