from data_handler.db_connection import CURSOR
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

def get_by_column_id(id:str):
    """Return all cards that belongs to the board

    Args:
        id (str): card id

    Returns:
        list: list of cards value
    """    
    try:
        column_id = int(id)
        query = 'SELECT * FROM cards WHERE column_id = %s AND NOT archived ORDER BY order_number'
        CURSOR.execute(query, [column_id])
        if CURSOR.rowcount == 0:
                raise ValueError
        return True, CURSOR.fetchall()
    except ValueError:
        return False, 'ValueError: Passed wrong value'
    except KeyError:
        return False,'KeyError: Passed wrong key'

def add(id:str, data:dict):
    """Inserts new card into the table

    Args:
        data (dict): dict with key 'name' and 'column_id'
    """
    try:
        id = int(id)
        data = [data['message'], get_new_order_number(id), id]
        query = 'INSERT INTO cards(message, order_number, column_id) VALUES (%s, %s, %s)'
        CURSOR.execute(query, data)
        return True, 'Card created successfully'
    except (ForeignKeyViolation, InvalidTextRepresentation):
        return False, 'InvalidTextRepresentation or ForeignKeyViolation: Passed wrong value'
    except KeyError:
        return False,'KeyError: Passed wrong key'
    
def delete_by_id(id:str):
    """Deletes card by id

    Args:
        data (dict): dict with card's id

    Returns:
        bool: true if succesful otherwise false
    """    
    # TODO: Order Number of first record
    try:
        id = int(id)
        card_data = get_one_by_id(id)
        query = 'DELETE FROM cards where id = %s'
        CURSOR.execute(query, [id])
        sort_out(card_data['column_id'], card_data['order_number'])
        return True, 'Card deleted successfully'
    except ValueError:
        return False, 'ValueError: Passed wrong value'
    except KeyError:
        return False,'KeyError: Passed wrong key'

def update_by_id(id:str, data:dict):
    """Updates cards by it's id

    Args:
        data (dict): dict with key 'id'

    Returns:
        bool: true if succesful otherwise false
    """
    def set_completed(id:str, data:dict):
        data = [data['completed'], id]
        query = 'UPDATE cards SET completed = %s WHERE id = %s'
        CURSOR.execute(query, data)
        
    def set_message(id:str, data:dict):
        data = [data['message'], id]
        query = 'UPDATE cards SET message = %s WHERE id = %s'
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
        if 'message' in data.keys():
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
    
def get_new_order_number(id:int):
    return len(get_by_column_id(id)[1]) + 1

def segregate(data:list):
    for record in data:
        result, message = update_by_id(record['id'], record)
        if not result:
            return False, message
    return True, message

def sort_out(column_id:int, order_number:int):
    data = [column_id, order_number]
    query = '''
    UPDATE cards SET order_number = order_number - 1 
    WHERE column_id = %s AND order_number > %s'''
    CURSOR.execute(query, data)