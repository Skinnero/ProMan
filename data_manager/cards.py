from data_manager.db_connection import CURSOR
from psycopg2.errors import InvalidTextRepresentation, ForeignKeyViolation

def get_one(id:str):
    """Get card by it's id

    Args:
        id (str): card id from endpoint
    Returns:
        RealDictRow : dict with keys, {id, message, order_number, completed, archived, column_id}
    """    
    try:
        id = int(id)
        query = 'SELECT * FROM cards WHERE id = %s'
        CURSOR.execute(query, [id])
        return CURSOR.fetchone()
    except ValueError:
        return False

def get_all_by_column_id(column_id:str):
    """Gets all cards from column id

    Args:
        id (str): column id from endpoint

    Returns:
        list[RealDictRow]: list of cards values
    """    
    try:
        column_id = int(column_id)
        print(column_id)
        query = 'SELECT * FROM cards WHERE column_id = %s AND NOT archived'
        CURSOR.execute(query, [column_id])
        # if CURSOR.rowcount == 0:
        #         raise ValueError
        return True, CURSOR.fetchall()
    except ValueError:
        return False, 'ValueError: Passed wrong value'
    except KeyError:
        return False,'KeyError: Passed wrong key'

def add(column_id:str, data:dict):
    """Inserts new card into the table

    Args:
        column_id (str): column id from endpoint
        data (dict): dict with keys, {message}
    
    Returns:
        bool + str: true if successfull else false, finally feedback
    """
    try:
        column_id = int(column_id)
        data = [data['title'], get_new_order_number(column_id), column_id]
        query = 'INSERT INTO cards(title, order_number, column_id) VALUES (%s, %s, %s)'
        CURSOR.execute(query, data)
        return True, 'Card created successfully'
    except (ForeignKeyViolation, InvalidTextRepresentation):
        return False, 'InvalidTextRepresentation or ForeignKeyViolation: Passed wrong value'
    except KeyError:
        return False,'KeyError: Passed wrong key'
    
def delete_by_id(id:str):
    """Deletes card by it's id

    Args:
        id (id): card id 

    Returns:
        bool + str: true if successfull else false, finally feedback
    """    
    try:
        id = int(id)
        card_data = get_one(id)
        query = 'DELETE FROM cards where id = %s'
        CURSOR.execute(query, [id])
        sort_out(card_data['column_id'], card_data['order_number'])
        if CURSOR.rowcount == 0:
            raise ValueError
        return True, 'Card deleted successfully'
    except ValueError:
        return False, 'ValueError: Passed wrong value'
    except KeyError:
        return False,'KeyError: Passed wrong key'

def update_by_id(id:str, data:dict):
    """Takes arguments and checks which column should be updated

    Args:
        id (str): card id 
        data (dict): dict with key, {message or completed or order_number or archived}

    Returns:
        bool + str: true if successfull else false, finally feedback
    """
    def set_completed(id:str, data:dict):
        data = [data['completed'], id]
        query = 'UPDATE cards SET completed = %s WHERE id = %s'
        CURSOR.execute(query, data)
        
    def set_message(id:str, data:dict):
        data = [data['title'], id]
        query = 'UPDATE cards SET title = %s WHERE id = %s'
        CURSOR.execute(query, data)
        
    def set_order_number(id:str, data:dict):
        data = [data['order_number'], id]
        query = 'UPDATE cards SET order_number = %s WHERE id = %s'
        CURSOR.execute(query, data)

    def set_archived(id:str, data:dict):
        data = [data['archived'], id]
        query = 'UPDATE cards SET archived = %s WHERE id = %s'
        CURSOR.execute(query, data)
    try:
        id = int(id)
        if 'title' in data.keys():
            set_message(id, data)
        elif 'order_number' in data.keys():
            data['order_number'] = int(data['order_number'])
            set_order_number(id, data)
        elif 'completed' in data.keys():
            set_completed(id, data)
        elif 'archived' in data.keys():
            set_archived(id, data)
        else:
            return False,'KeyError: Passed wrong key'
    except ValueError:
        return False, 'ValueError: Passed wrong value'
    return True, 'Column updated successfully'
    
def get_new_order_number(column_id:int):
    """Calls function that returns list of cards then 
    add + 1 to its len and returns it

    Args:
        column_id (int): column id

    Returns:
        int: len of columns + 1
    """    
    return len(get_all_by_column_id(column_id)[1]) + 1

def segregate(data:list):
    """Takes list of data from json and updates every record

    Args:
        data (list): list with cards values

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