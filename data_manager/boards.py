from data_manager.db_connection import CURSOR
from data_manager.columns import create_default

def get_all():
    """Get all boards from DB

    Returns:
        list: list of dictionaries
    """    
    query = 'SELECT * FROM boards;'
    CURSOR.execute(query)
    return CURSOR.fetchall()


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
    def get_most_recent():
        """Gets most recet added board

        Returns:
            dict: dict with most recent board values
        """        
        query = 'SELECT * FROM boards ORDER BY id DESC'
        CURSOR.execute(query)
        return CURSOR.fetchone() 
       
    data = [data['name'], data['user_id']]
    query = 'INSERT INTO boards(name, user_id) VALUES (%s, %s)'
    CURSOR.execute(query, data)
    create_default(get_most_recent())

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
    