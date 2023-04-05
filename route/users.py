from flask import Blueprint, request, session, redirect, url_for
import data_manager.users as users
from util import hash_user_password, compare_password

api_users = Blueprint('api_users', __name__)

@api_users.route('/api/users/sign-up', methods=['POST'])   
def sing_up():
    data = request.json
    try:
        data['password'] = hash_user_password(data['password'])
        result, message = users.add(data)
        if result:
            session['user'] = users.get_by_name(data['name'])
            session.permanent = False
            return message, 200
        return message, 404
    except KeyError:
        return 'KeyError: Passed wrong key', 404
    
@api_users.route('/api/users/log-in', methods=['POST'])   
def log_in():
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
    session.clear()
    return redirect(url_for('index'))