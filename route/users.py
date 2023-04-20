from flask import Blueprint, request, redirect, url_for, jsonify
from flask_jwt_extended import create_access_token, set_access_cookies, unset_access_cookies
import data_handler.users as users
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
            response = jsonify({"msg": 'Login successful'})
            access_token = create_access_token(identity=users.get_by_name(data['name']))
            return jsonify(access_token=access_token)
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
    # TODO: FIX WHEN USER IS NOT IN DB
    data = request.json
    try:
        user_password = users.get_password_by_name(data['name'])
        if compare_password(data['password'], user_password['password']):
            response = jsonify({"msg": 'Login successful'})
            access_token = create_access_token(identity=users.get_by_name(data['name']))
            print(set_access_cookies(response, access_token))
            return jsonify(access_token=access_token)
        return 'Name or password incorrect', 404
    except KeyError:
        return 'KeyError: Passed wrong key', 404


@api_users.route('/api/users/log-out', methods=['GET'])
def log_out():
    """Clears session so user won't be logged in

    Returns:
        redirect: goes back to index website
    """
    unset_access_cookies(jsonify({"msg": 'Logout successful'}))
    return redirect(url_for('index'))
