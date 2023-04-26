from flask import Blueprint, request, session, redirect, url_for, jsonify, make_response
from flask_jwt_extended import create_access_token, set_access_cookies, unset_jwt_cookies
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
    data['password'] = hash_user_password(data['password'])
    result, response = users.add(data)
    if result:
        access_token = create_access_token(identity=users.get_by_name(data['name']))
        response = make_response()
        set_access_cookies(response, access_token)
        return response
    return response, 404


@api_users.route('/api/users/log-in', methods=['POST'])
def log_in():
    """Checks if user provided correct data to be logged in
    and creates session for him

    Returns:
        str: feedback + status code
    """
    data = request.json
    user_password = users.get_password_by_name(data['name'])
    if compare_password(data['password'], user_password['password']):
        access_token = create_access_token(identity=users.get_by_name(data['name']))
        response = make_response()
        set_access_cookies(response, access_token)
        return response
    return 'Name or password incorrect', 404


@api_users.route('/api/users/log-out', methods=['GET'])
def log_out():
    """Clears session so user won't be logged in

    Returns:
        redirect: goes back to index website
    """
    response = make_response()
    unset_jwt_cookies(response)
    return response
