from data_handler.db_connection import CURSOR
from psycopg2.errors import InvalidTextRepresentation, ForeignKeyViolation


def get_one_by_id(card_id: int):
    """Get card by its id

    Args:
        card_id (int): card id
    Returns:
        RealDictRow: card values
    """
    query = 'SELECT * FROM cards WHERE id = %s'
    CURSOR.execute(query, [card_id])
    return CURSOR.fetchone()


def get_by_column_id(column_id: int):
    """Return all cards that belongs to the board

    Args:
        column_id (int): card id

    Returns:
        List[RealDictRow]: list of cards value
    """
    query = 'SELECT * FROM cards WHERE column_id = %s AND NOT archived ORDER BY order_number'
    CURSOR.execute(query, [column_id])
    return True, CURSOR.fetchall()


def add(column_id: int, card_data: dict):
    """Inserts new card into the table

    Args:
        column_id (int): column id
        card_data (dict): dict with key 'name' and 'column_id'
    """
    try:
        data = [card_data['title'], get_new_order_number(column_id), column_id]
        query = 'INSERT INTO cards(title, order_number, column_id) VALUES (%s, %s, %s)'
        CURSOR.execute(query, data)
        return True, 'Card created successfully'
    except (ForeignKeyViolation, InvalidTextRepresentation):
        return False, 'InvalidTextRepresentation or ForeignKeyViolation: Passed wrong value'
    except KeyError:
        return False, 'KeyError: Passed wrong key'


def delete_by_id(card_id: int):
    """Deletes card by id

    Args:
        card_id (int): column id

    Returns:
        bool: true if successful otherwise false
    """
    # TODO: Order Number of first record
    try:
        card_data = get_one_by_id(card_id)
        query = 'DELETE FROM cards where id = %s'
        CURSOR.execute(query, [card_id])
        sort_out_on_delete(card_data['column_id'], card_data['order_number'])
        return True, 'Card deleted successfully'
    except KeyError:
        return False, 'KeyError: Passed wrong key'


def update_by_id(card_id: int, card_data: dict):
    """Updates cards by its id

    Args:
        card_id (int): column id
        card_data (dict): dict with key 'id'

    Returns:
        bool: true if successful otherwise false
    """

    def set_completed(card_id: int, card_data: dict):
        data = [card_data['completed'], card_id]
        query = 'UPDATE cards SET completed = %s WHERE id = %s'
        CURSOR.execute(query, data)

    def set_message(card_id: int, card_data: dict):
        data = [card_data['title'], card_id]
        query = 'UPDATE cards SET title = %s WHERE id = %s'
        CURSOR.execute(query, data)

    def set_order_number(card_id: int, card_data: dict):
        data = [card_data['order_number'], card_id]
        query = 'UPDATE cards SET order_number = %s WHERE id = %s'
        CURSOR.execute(query, data)

    def set_archived(card_id: int, card_data: dict):
        data = [card_data['archived'], card_id]
        query = 'UPDATE cards SET archived = %s WHERE id = %s'
        CURSOR.execute(query, data)

    def set_column_id(card_id: int, card_data: dict):
        data = [card_data['column_id'], card_id]
        query = 'UPDATE cards SET column_id = %s WHERE id = %s'
        CURSOR.execute(query, data)

    if 'title' in card_data.keys():
        set_message(card_id, card_data)
    if 'column_id' in card_data.keys():
        set_column_id(card_id, card_data)
    if 'order_number' in card_data.keys():
        set_order_number(card_id, card_data)
    if 'completed' in card_data.keys():
        set_completed(card_id, card_data)
    if 'archived' in card_data.keys():
        set_archived(card_id, card_data)
    return True, 'Column updated successfully'


def get_new_order_number(column_id: int):
    """Gets new number when adding a card

    Args:
        column_id (int): column id

    Returns:
        int: new number for ordering
    """
    len_of_cards = get_by_column_id(column_id)[-1]
    return len(len_of_cards) + 1 if type(len_of_cards) is list else 1


def segregate(column_id: int, card_data: list):
    """Takes a list of data and updates them

    Args:
        card_data (list): list of cards values
        column_id (int): column id

    Returns:
        bool: true if successful otherwise false
    """
    for record in card_data:
        card = get_one_by_id(record['id'])
        if 'column_id' not in record.keys():
            sort_out_on_update(column_id, record['order_number'], card)
            result, response = update_by_id(record['id'], record)
        else:
            sort_out_on_delete(column_id, record['order_number'])
            sort_out_on_update(record['column_id'], record['order_number'], card)
            result, response = update_by_id(record['id'], record)
        if not result:
            return False, response
    return True, 'Updated Successfully'


def sort_out_on_delete(column_id: int, order_number: int):
    """Sorts cards on deletion

    Args:
        column_id (int): column id
        order_number (int): of deleted card
    """
    data = [column_id, order_number]
    query = '''
    UPDATE cards SET order_number = order_number - 1 
    WHERE column_id = %s AND order_number > %s'''
    CURSOR.execute(query, data)


def sort_out_on_update(column_id: int, order_number: int, card: dict):
    """Sorts cards on update

    Args:
        column_id (int): column id
        order_number (int): of deleted card
        card (dict): cards data
    """
    if card['order_number'] < order_number:
        data = [column_id, card['order_number'], order_number]
        print(data)
        query = '''
        UPDATE cards SET order_number = order_number - 1 
        WHERE column_id = %s AND order_number BETWEEN %s AND %s'''
    else:
        data = [column_id, order_number, card['order_number']]
        query = '''
        UPDATE cards SET order_number = order_number + 1 
        WHERE column_id = %s AND order_number BETWEEN %s AND %s'''
    CURSOR.execute(query, data)
