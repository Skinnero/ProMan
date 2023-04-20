from flask import Blueprint, request, session, redirect, url_for
import data_manager.users as users
from util import hash_user_password, compare_password

api_users = Blueprint('api_users', __name__)


@api_users.route('/api/users/sign-up', methods=['POST'])   
def sing_up():
    """Sings the user up and automatically creates session for him

    Returns:
        str: feedback + status code
    """    
    data = request.json
    try:
        data['password'] = hash_user_password(data['password'])
        result, response = users.add(data)
        if result:
            session['user'] = users.get_by_name(data['name'])
            session.permanent = False
            return response, 200
        return response, 404
    except KeyError:
        return 'KeyError: Passed wrong key', 404


@api_users.route('/api/users/log-in', methods=['POST'])   
def log_in():
    """Checks if user provided correct data to be logged in
    and creates session for him

    Returns:
        str: feedback + status code
    """    
    data = request.json
    try:
        user_password = users.get_password_by_name(data['name'])
        if compare_password(data['password'], user_password['password']):
            session['user'] = users.get_by_name(data['name'])
            session.permanent = False
            return 'User logged in', 200
        return 'Name or password incorrect', 404
    except KeyError:
        return 'KeyError: Passed wrong key', 404


@api_users.route('/api/users/log-out', methods=['GET'])
def log_out():
    """Clears session so user won't be logged in

    Returns:
        redirect: goes back to index website
    """    
    session.clear()
    return redirect(url_for('index'))
