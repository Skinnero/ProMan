import bcrypt


def hash_user_password(pw: str):
    """Hashes password so it can be safely saved in db

    Args:
        pw (str): password provided by user

    Returns:
        str: decoded hash
    """    
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()


def compare_password(pw: str, hashed_pw: str):
    """Compares password provided by users with
    the one that belong to user with that name

    Args:
        pw (str): password provided by user
        hashed_pw (str): hashed password from db

    Returns:
        bool: true if correct else false
    """    
    return bcrypt.checkpw(pw.encode(), hashed_pw.encode())
