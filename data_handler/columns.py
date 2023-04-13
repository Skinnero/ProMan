from data_handler.db_connection import CURSOR
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
    INSERT INTO columns(name, order_number, board_id) VALUES ('To do', 1, {board_id});
    INSERT INTO columns(name, order_number, board_id) VALUES ('Additional', 2, {board_id});
    INSERT INTO columns(name, order_number, board_id) VALUES ('Doing', 3, {board_id});
    INSERT INTO columns(name, order_number, board_id) VALUES ('Done', 4, {board_id});
    """
    CURSOR.execute(query)

def get_by_board_id(id:str):
    """Return all columns that belongs to the board

    Args:
        id (str): columns id

    Returns:
        list: list of columns value
    """    
    try:
        board_id = int(id)
        query = 'SELECT * FROM columns WHERE board_id = %s ORDER BY order_number'
        CURSOR.execute(query, [board_id])
        if CURSOR.rowcount == 0:
            raise ValueError
        return True, CURSOR.fetchall()
    except ValueError:
        return False, 'ValueError: Passed wrong value'
    except KeyError:
        return False,'KeyError: Passed wrong key'
    
def delete_by_id(id:str):
    """Deletes column by id

    Args:
        id (str): str with columns's id

    Returns:
        bool: true if succesful otherwise false
    """    
    try:
        id = int(id)
        column_data = get_one_by_id(id)
        query = 'DELETE FROM columns where id = %s'
        CURSOR.execute(query, [id])
        sort_out(column_data['board_id'], column_data['order_number'])
        if CURSOR.rowcount == 0:
            raise ValueError
        return True, 'Column deleted successfully'
    except ValueError:
        return False, 'ValueError: Passed wrong value'
    except KeyError:
        return False,'KeyError: Passed wrong key'
    
def add(id:str, data:str):
    """Inserts new column into the table

    Args:
        id (str): str with board_id
    """
    try:
        id = int(id)
        data = [data['name'], get_new_order_number(id), id]
        query = 'INSERT INTO columns(name, order_number, board_id) VALUES (%s, %s, %s)'
        CURSOR.execute(query, data)
        return True, 'Column created successfully'
    except (ForeignKeyViolation, InvalidTextRepresentation, ValueError):
        return False, 'InvalidTextRepresentation or ForeignKeyViolation: Passed wrong value'
    except KeyError:
        return False,'KeyError: Passed wrong key'

def update_by_id(id:str, data:dict):
    """Updates columns by it's id

    Args:
        data (dict): dict with key 'id'

    Returns:
        bool: true if succesful otherwise false
    """
    def set_name(id:str, data:dict):
        data = [data['name'], id]
        query = 'UPDATE columns SET name = %s WHERE id = %s'
        CURSOR.execute(query, data)

    def set_order_number(id:str, data:dict):
        data = [data['order_number'], id]
        query = 'UPDATE columns SET order_number = %s WHERE id = %s'
        CURSOR.execute(query, data)

    try:
        id = int(id)
        if 'name' in data.keys():
            set_name(id, data)
        elif 'order_number' in data.keys():
            data['order_number'] = int(data['order_number'])
            set_order_number(id, data)
        else:
            return False,'KeyError: Passed wrong key' 
    except ValueError:
        return False, 'ValueError: Passed wrong value'
    return True, 'Column updated successfully'

    

def get_new_order_number(id:int):
    
    return len(get_by_board_id(id)[1]) + 1

def segregate(data:list):
    
    for record in data:
        result, message = update_by_id(record['id'], record)
        if not result:
            return False, message

    return True, message


def sort_out(board_id:int, order_number:int):
    data = [board_id, order_number]
    query = '''
    UPDATE columns SET order_number = order_number - 1 
    WHERE board_id = %s AND order_number > %s'''
    CURSOR.execute(query, data)