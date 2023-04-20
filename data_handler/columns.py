from data_handler.db_connection import CURSOR
from psycopg2.errors import InvalidTextRepresentation, ForeignKeyViolation


def get_one_by_id(column_id: int):
    """Get column by its id

    Args:
        column_id (int): column id
    Returns:
        RealDictRow: column values
    """
    query = 'SELECT * FROM columns WHERE id = %s'
    CURSOR.execute(query, [column_id])
    return CURSOR.fetchone()


def create_default_columns(column_data: dict):
    """Creates default columns for new board

    Args:
        column_data (dict): board id
    """
    board_id = column_data['id']
    query = f"""
    INSERT INTO columns(title, order_number, board_id) VALUES ('To do', 1, {board_id});
    INSERT INTO columns(title, order_number, board_id) VALUES ('Additional', 2, {board_id});
    INSERT INTO columns(title, order_number, board_id) VALUES ('Doing', 3, {board_id});
    INSERT INTO columns(title, order_number, board_id) VALUES ('Done', 4, {board_id});
    """
    CURSOR.execute(query)


def get_by_board_id(board_id: int):
    """Return all columns that belongs to the board

    Args:
        board_id (int): columns id

    Returns:
        List[RealDictRow]: list of columns value
    """
    query = 'SELECT * FROM columns WHERE board_id = %s ORDER BY order_number'
    CURSOR.execute(query, [board_id])
    return True, CURSOR.fetchall()


def delete_by_id(column_id: int):
    """Deletes column by id

    Args:
        column_id (int): str with columns id

    Returns:
        bool: true if successful otherwise false
    """
    column_data = get_one_by_id(column_id)
    query = 'DELETE FROM columns where id = %s'
    CURSOR.execute(query, [column_id])
    sort_out_on_delete(column_data['board_id'], column_data['order_number'])
    return True, 'Column deleted successfully'


def add(board_id: int, column_data: dict):
    """Inserts new column into the table

    Args:
        board_id (int): int with board_id
        column_data (dict): new colum values

    """
    try:
        data = [column_data['title'], get_new_order_number(board_id), board_id]
        query = 'INSERT INTO columns(title, order_number, board_id) VALUES (%s, %s, %s)'
        CURSOR.execute(query, data)
        return True, 'Column created successfully'
    except (ForeignKeyViolation, InvalidTextRepresentation):
        return False, 'InvalidTextRepresentation or ForeignKeyViolation: Passed wrong value'
    except KeyError:
        return False, 'KeyError: Passed wrong key'


def update_by_id(column_id: int, column_data: dict):
    """Updates columns by its id

    Args:
        column_id (int): column id
        column_data (dict): dict with key 'id'

    Returns:
        bool: true if successful otherwise false
    """
    def set_name(column_id: int, column_data: dict):
        data = [column_data['title'], column_id]
        query = 'UPDATE columns SET title = %s WHERE id = %s'
        CURSOR.execute(query, data)

    def set_order_number(column_id: int, column_data: dict):
        data = [column_data['order_number'], column_id]
        query = 'UPDATE columns SET order_number = %s WHERE id = %s'
        CURSOR.execute(query, data)

    if 'title' in column_data.keys():
        set_name(column_id, column_data)
    elif 'order_number' in column_data.keys():
        set_order_number(column_id, column_data)
    else:
        return False, 'KeyError: Passed wrong key'
    return True, 'Column updated successfully'


def get_new_order_number(board_id: int):
    """Gets new number when adding a column

    Args:
        board_id (int): column id

    Returns:
        int: new number for ordering
    """
    len_of_columns = get_by_board_id(board_id)[-1]
    return len(len_of_columns) + 1 if type(len_of_columns) is list else 1


def segregate(board_id: int, column_data: list):
    """Takes a list of data and updates them

    Args:
        board_id (int): board id
        column_data (list): list of cards values

    Returns:
        bool: true if successful otherwise false
    """
    for record in column_data:
        column = get_one_by_id(record['id'])
        sort_out_on_update(board_id, record['order_number'], column)
        result, message = update_by_id(record['id'], record)
        if not result:
            return False, message
    return True, 'Columns updated successfully'


def sort_out_on_delete(board_id: int, order_number: int):
    """Sorts cards on deletion

    Args:
        board_id (int): column id
        order_number (int): of deleted card
    """
    data = [board_id, order_number]
    query = '''
    UPDATE columns SET order_number = order_number - 1 
    WHERE board_id = %s AND order_number > %s'''
    CURSOR.execute(query, data)


def sort_out_on_update(board_id: int, order_number: int, column: dict):
    """Sorts cards on update

    Args:
        board_id (int): column id
        order_number (int): of deleted card
        column (dict): columns data
    """
    if column['order_number'] < order_number:
        data = [board_id, column['order_number'], order_number]
        query = '''
        UPDATE columns SET order_number = order_number - 1 
        WHERE board_id = %s AND order_number BETWEEN %s AND %s'''
    else:
        data = [board_id, order_number, column['order_number']]
        query = '''
        UPDATE columns SET order_number = order_number + 1 
        WHERE board_id = %s AND order_number BETWEEN %s AND %s'''
    CURSOR.execute(query, data)
