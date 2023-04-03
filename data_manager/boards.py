from data_manager.db_connection import CURSOR

def get_all():
    """Get all boards from DB

    Returns:
        list: list of dictionaries
    """    
    query = 'SELECT * FROM boards;'
    CURSOR.execute(query)
    return CURSOR.fetchall()

def delete_by_id(id:str):
    """Deletes board by id

    Args:
        id (str): board's id

    Returns:
        bool: true if succesful otherwise false
    """    
    try:
        id = int(id)
        query = 'DELETE FROM boards where id=%s'
        CURSOR.execute(query, [id])
        return True
    except:
        return False

def add(data):

    query = 'INSERT INTO boards(name, user_id) VALUES (%s, %s)'
