from flask import Flask, render_template, request
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from flask_socketio import SocketIO, emit, leave_room, join_room, rooms
from datetime import timedelta
from dotenv import load_dotenv
from os import environ

from route.boards import api_boards
from route.columns import api_columns
from route.cards import api_cards
from route.users import api_users
from data_handler.boards import get_all
from data_handler.columns import get_one_by_id

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

socketio = SocketIO(app, cors_allowed_origins='*')
jwt = JWTManager(app)

# ROOMS MANAGEMENT


@socketio.on('join')
def on_join(room_id):
    join_room(room_id)


@socketio.on('leave')
def on_leave(room_id):
    leave_room(room_id)

# BOARDS MANAGEMENT


@socketio.on('update_board_title')
def update_board_title(board_id, board_title):
    emit('update_board_title', (board_id, board_title), skip_sid=request.sid, to=rooms())


@socketio.on('delete_board')
def delete_board_handler(board_id):
    emit('delete_board', board_id, skip_sid=request.sid, to=rooms())

# COLUMNS MANAGEMENT


@socketio.on('update_column_title')
def update_column_title(column_title, column_id):
    emit('update_column_title', (column_title, column_id), skip_sid=request.sid, to=rooms())


@socketio.on('update_column_position')
def update_column_position(first_column_id, second_column_id):
    first_column = get_one_by_id(first_column_id)
    second_column = get_one_by_id(second_column_id)
    emit('update_column_position', (first_column, second_column), skip_sid=request.sid, to=rooms())


@socketio.on('create_column')
def create_column_handler(column_data, board_id):
    emit('create_column', (column_data, board_id), skip_sid=request.sid, to=rooms())


@socketio.on('delete_column')
def delete_column_handler(column_id):
    emit('delete_column', column_id, skip_sid=request.sid, to=rooms())

# CARDS MANAGEMENT


@socketio.on('update_card_title')
def update_card_title(card_title, card_id):
    emit('update_card_title', (card_title, card_id), skip_sid=request.sid, to=rooms())


@socketio.on('update_card_position')
def update_card_position(card_id, column_id):
    emit('update_card_position', (card_id, column_id), skip_sid=request.sid, to=rooms())


@socketio.on('create_card')
def create_card_handler(card_data, column_id):
    emit('create_card', (card_data, column_id), skip_sid=request.sid, to=rooms())


@socketio.on('delete_card')
def delete_card_handler(card_id):
    emit('delete_card', card_id, skip_sid=request.sid, to=rooms())


@app.route("/")
@jwt_required(optional=True)
def index():
    """Render main page

    Returns:
        render_template: index.html
    """
    return render_template('index.html', boards=get_all(), user=get_jwt_identity())


if __name__ == '__main__':
    socketio.run(app, debug=True)

