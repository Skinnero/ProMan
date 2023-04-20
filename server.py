from flask import Flask, render_template, jsonify
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
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
app.config['JWT_SECRET_KEY'] = b'xD'
app.config['SECRET_KEY'] = b'-_-'
jwt = JWTManager(app)


@app.route("/")
def index():
    """Render main page

    Returns:
        render_template: index.html
    """
    return render_template('index.html', boards=get_all())


@app.route('/private', methods=["GET"])
@jwt_required()
def user_room():
    current_user = get_jwt_identity()
    print(current_user)
    return jsonify(logged_in_as=current_user), 200

def main():
    """Main function
    """
    app.run(debug=True)


if __name__ == '__main__':
    main()
