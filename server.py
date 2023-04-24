from flask import Flask, render_template, jsonify, request, make_response, redirect
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, get_jwt, unset_access_cookies
from flask_socketio import SocketIO, emit, rooms, join_room, leave_room, send
from dotenv import load_dotenv
from datetime import timedelta
from os import environ

from route.boards import api_boards
from route.columns import api_columns
from route.cards import api_cards
from route.users import api_users
from data_handler.boards import get_all

load_dotenv()

app = Flask(__name__)
app.register_blueprint(api_boards)
app.register_blueprint(api_columns)
app.register_blueprint(api_cards)
app.register_blueprint(api_users)
app.config['SECRET_KEY'] = environ.get('SECRET_KEY')
app.config['JWT_SECRET_KEY'] = environ.get('JWT_SECRET_KEY')

app.config['JWT_TOKEN_LOCATION'] = ["cookies"]
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=5)

socketio = SocketIO(app, cross_allowed_origins='*')
jwt = JWTManager(app)

# TODO: store secrets key in .env before deployment!!!


@app.route("/")
@jwt_required(optional=True)
def index():
    """Render main page

    Returns:
        render_template: index.html
    """
    user = get_jwt_identity()
    return render_template('index.html', boards=get_all(), user=user)


@socketio.on("connect")
@jwt_required(optional=True)
def handle_connect():
    emit("connect", 'You are connected to server!', broadcast=False)
    print(get_jwt_identity())


# @socketio.on("message")
# def handle_message(message):
#     emit("message", 'Hello back!')
#     print(message)


@socketio.on('join')
def on_join(room_id):
    join_room(room_id)
    print(rooms())


@socketio.on('leave')
def on_leave(room_id):
    leave_room(room_id)
    print(rooms())


@socketio.on('create_column')
def create_handler(column_html):
    emit('create_column', column_html, skip_sid=request.sid, to=rooms()[1])
    print(column_html)


def main():
    socketio.run(app, debug=True)


if __name__ == '__main__':
    main()
