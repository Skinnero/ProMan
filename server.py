from flask import Flask, render_template, jsonify
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, get_jwt
from flask_socketio import SocketIO, emit, rooms, join_room, leave_room
from datetime import timedelta

from route.boards import api_boards
from route.columns import api_columns
from route.cards import api_cards
from route.users import api_users
from data_handler.boards import get_all

app = Flask(__name__)
app.register_blueprint(api_boards)
app.register_blueprint(api_columns)
app.register_blueprint(api_cards)
app.register_blueprint(api_users)
app.config['SECRET_KEY'] = '-_-'
app.config['JWT_SECRET_KEY'] = 'xD'

app.config['JWT_COOKIE_SECURE'] = False
app.config['JWT_TOKEN_LOCATION'] = ["cookies"]
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=2)

socketio = SocketIO(app, cross_allowed_origins='*')
jwt = JWTManager(app)
# TODO: store secrets key in .env before deployment!!!


@app.route("/")
def index():
    """Render main page

    Returns:
        render_template: index.html
    """    
    return render_template('index.html', boards=get_all())


@socketio.on("message")
def handle_connect(message):
    emit("message", 'Hello back!')
    print('Received Data: ' + message)


@socketio.on('join')
def on_join(room_id):
    join_room(room_id)
    print(rooms())


@app.route('/private', methods=["GET"])
@jwt_required()
def user_room():
    print('WTF')
    # print(get_jwt_identity(), get_jwt())
    # current_user = get_jwt_identity()
    # print(current_user)
    return jsonify(logged_in_as='xD'), 200


def main():
    socketio.run(app, debug=True)


if __name__ == '__main__':
    main()
