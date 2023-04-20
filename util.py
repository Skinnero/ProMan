import bcrypt


def hash_user_password(pw: str):
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()


def compare_password(pw: str, hashed_pw: str):
    return bcrypt.checkpw(pw.encode(), hashed_pw.encode())