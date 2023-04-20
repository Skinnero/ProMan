from data_handler.db_connection import CURSOR
from data_handler.columns import create_default_columns
from psycopg2.errors import InvalidTextRepresentation, ForeignKeyViolation


def get_one_by_id(board_id: int):
    """Get board by its id

    Args:
        board_id (int): board id

    Returns:
        RealDictRow: board values
    """
    query = 'SELECT * FROM boards WHERE id = %s'
    CURSOR.execute(query, [board_id])
    return CURSOR.fetchone()


def get_all():
    """Get all boards from DB

    Returns:
        List[RealDictRow]: list of dictionaries
    """
    query = 'SELECT * FROM boards ORDER BY id'
    CURSOR.execute(query)
    return CURSOR.fetchall()


def delete_by_id(board_id: int):
    """Deletes board by id

    Args:
        board_id (int): str with board's id

    Returns:
        bool: true if successful otherwise false
    """
    query = 'DELETE FROM boards where id = %s'
    CURSOR.execute(query, [board_id])
    return True, 'Board deleted successfully'


def add(board_data: dict):
    """Inserts new board into the table

    Args:
        board_data (dict): dict with key 'name' and 'user_id'
    """

    def get_most_recent():
        """Gets most recent added board

        Returns:
            dict: dict with most recent board values
        """
        next_query = 'SELECT * FROM boards ORDER BY id DESC LIMIT 1'
        CURSOR.execute(next_query)
        return CURSOR.fetchone()

    try:
        data = [board_data['title'], board_data['user_id']]
        query = 'INSERT INTO boards(title, user_id) VALUES (%s, %s)'
        CURSOR.execute(query, data)
        create_default_columns(get_most_recent())
        return 'Board Created'
    except KeyError:
        return 'KeyError: Passed wrong key'
    except (ForeignKeyViolation, InvalidTextRepresentation):
        return 'InvalidTextRepresentation or ForeignKeyViolation: Passed wrong values'


def update_by_id(board_id: int, boards_data: dict):
    """Updates boards by its id

    Args:
        board_id (int): board id
        boards_data (dict): dict with key 'id'

    Returns:
        bool: true if successful otherwise false
    """

    def set_private(board_id: int, boards_data: dict):
        data = [boards_data['private'], board_id]
        query = 'UPDATE boards SET private = %s WHERE id = %s'
        CURSOR.execute(query, data)

    def set_name(board_id: int, boards_data: dict):
        data = [boards_data['title'], board_id]
        query = 'UPDATE boards SET title = %s WHERE id = %s'
        CURSOR.execute(query, data)

    if 'title' in boards_data.keys():
        set_name(board_id, boards_data)
    elif 'private' in boards_data.keys():
        set_private(board_id, boards_data)
    else:
        return False, 'KeyError: Passed wrong key'
    return True, 'Board updated successfully'
