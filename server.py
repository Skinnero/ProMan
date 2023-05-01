from flask import Flask, render_template
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from flask_socketio import SocketIO
from datetime import timedelta
from dotenv import load_dotenv
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

socketio = SocketIO(app)
jwt = JWTManager(app)
import web_sockets


@app.route("/")
@jwt_required(optional=True)
def index():
    """Render main page

    Returns:
        render_template: index.html
    """
    return render_template('index.html', boards=get_all(), user=get_jwt_identity())


def main():
    """Main function
    """
    socketio.run(app, debug=True)


if __name__ == '__main__':
    main()
