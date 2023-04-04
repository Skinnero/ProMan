from data_manager.db_connection import CURSOR

def create_default(data:dict):

    board_id = data['id']
    query = f"""
    INSERT INTO columns(name, board_id) VALUES ('To do', {board_id});
    INSERT INTO columns(name, board_id) VALUES ('Additional', {board_id});
    INSERT INTO columns(name, board_id) VALUES ('Doing', {board_id});
    INSERT INTO columns(name, board_id) VALUES ('Done', {board_id});
    """
    CURSOR.execute(query)

def get_by_board_id(data):

    try:
        id = int(data['board_id'])
        query = 'SELECT * FROM columns WHERE board_id = %s'
        CURSOR.execute(query, [id])
        return CURSOR.fetchall()
    except ValueError:
        return False
    

def delete_by_id(data:dict):
    """Deletes board by id

    Args:
        data (dict): dict with board's id

    Returns:
        bool: true if succesful otherwise false
    """    
    try:
        id = int(data['id'])
        query = 'DELETE FROM boards where id = %s'
        CURSOR.execute(query, [id])
        return True
    except ValueError:
        return False
    
def add(data:dict):
    """Inserts new board into the table

    Args:
        data (dict): dict with key 'name' and 'user_id'
    """    
    data = [data['name'], data['board_id']]
    query = 'INSERT INTO boards(name, user_id) VALUES (%s, %s)'
    CURSOR.execute(query, data)

def rename_by_id(data:dict):
    """Updates boards by it's id

    Args:
        data (dict): dict with key 'id'

    Returns:
        bool: true if succesful otherwise false
    """    
    try:
        id = int(data['id'])
        data = [data['name'], id]
        query = 'UPDATE boards SET name = %s WHERE id = %s'
        CURSOR.execute(query, data)
        return True
    except ValueError:
        return False