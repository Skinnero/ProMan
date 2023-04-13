from data_manager.db_connection import CURSOR
from psycopg2.errors import InvalidTextRepresentation, ForeignKeyViolation

def get_one(id:str):
    """Gets column by it's id and returns it

    Args:
        id (str): column id from endpoint
        
    Returns:
        RealDictRow: dict with keys, {id, name, order_number, board_id}
    """    
    try:
        id = int(id)
        query = 'SELECT * FROM columns WHERE id = %s'
        CURSOR.execute(query, [id])
        return CURSOR.fetchone()
    except ValueError:
        return False

def create_default_columns(data:dict):
    """Creates default columns for new board

    Args:
        data (RealDictRow): data with {id} key
    """    
    board_id = data['id']
    query = f"""
    INSERT INTO columns(title, order_number, board_id) VALUES ('To do', 1, {board_id});
    INSERT INTO columns(title, order_number, board_id) VALUES ('Additional', 2, {board_id});
    INSERT INTO columns(title, order_number, board_id) VALUES ('Doing', 3, {board_id});
    INSERT INTO columns(title, order_number, board_id) VALUES ('Done', 4, {board_id});
    """
    CURSOR.execute(query)

def get_all_by_board_id(board_id:str):
    """Returns all columns that belongs to the board

    Args:
        id (str): board id from endpoint

    Returns:
        list[RealDictRow]: list of columns with values
    """ 
    print(board_id)   
    try:
        board_id = int(board_id)
        query = 'SELECT * FROM columns WHERE board_id = %s ORDER BY order_number'
        CURSOR.execute(query, [board_id])
        # if CURSOR.rowcount == 0:
        #     raise ValueError
        return True, CURSOR.fetchall()
    except ValueError:
        return False, 'ValueError: Passed wrong value'
    except KeyError:
        return False,'KeyError: Passed wrong key'
    
def delete_by_id(id:str):
    """Deletes column by id

    Args:
        id (str): column id from endpoint

    Returns:
        bool: true if succesful otherwise false, finally feedback
    """    
    try:
        id = int(id)
        column_data = get_one(id)
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
    
def add(board_id:str, data:dict):
    """Inserts new column into db

    Args:
        id (str): board id from endpoint
        data (dict): data with key, {name}

    Returns:
        bool + str: true if successfull else false, finally feedback
    """    
    print(board_id)
    try:
        board_id = int(board_id)
        data = [data['title'], get_new_order_number(board_id), board_id]
        query = 'INSERT INTO columns(title, order_number, board_id) VALUES (%s, %s, %s)'
        CURSOR.execute(query, data)
        return True, 'Column created successfully'
    except (ForeignKeyViolation, InvalidTextRepresentation, ValueError):
        return False, 'InvalidTextRepresentation or ForeignKeyViolation: Passed wrong value'
    except KeyError:
        return False,'KeyError: Passed wrong key'

def update_by_id(id:str, data:dict):   
    """Takes arguments and checks which column should be updated

    Args:
        id (str): column id from endpoint
        data (dict): data with key, {name or order_number}

    Returns:
        bool + str: true if successfull else false, finally feedback
    """    
    def set_name(id:str, data:dict):    
        data = [data['title'], id]
        query = 'UPDATE columns SET title = %s WHERE id = %s'
        CURSOR.execute(query, data)

    def set_order_number(id:str, data:dict):
        data = [data['order_number'], id]
        query = 'UPDATE columns SET order_number = %s WHERE id = %s'
        CURSOR.execute(query, data)

    try:
        id = int(id)
        if 'title' in data.keys():
            set_name(id, data)
        elif 'order_number' in data.keys():
            data['order_number'] = int(data['order_number'])
            set_order_number(id, data)
        else:
            return False,'KeyError: Passed wrong key' 
    except ValueError:
        return False, 'ValueError: Passed wrong value'
    return True, 'Column updated successfully'

def get_new_order_number(board_id:int):
    """Calls function that returns list of columns then 
    add + 1 to its len and returns it

    Args:
        board_id (int): board id

    Returns:
        int: len of columns + 1
    """    
    return len(get_all_by_board_id(board_id)[1]) + 1

def segregate(data:list):
    """Takes list of data from json and updates every record

    Args:
        data (list): list with columns values

    Returns:
        bool + str: true if successfull else false, finally feedback
    """    
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