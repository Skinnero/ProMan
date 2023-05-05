from flask import Blueprint, jsonify, request
from flask_jwt_extended import decode_token
import data_handler.boards as boards

api_boards = Blueprint('api_boards', __name__)


@api_boards.route("/api/boards", methods=['GET', 'POST'])
def manage_all_boards():
    """Manages all boards,
    GET > Returns json with all boards,
    POST > Creates new boards with default columns,

    Returns:
        str or json: json when method GET else feedback, finally status code
    """
    if request.method == 'GET':
        return jsonify(boards.get_all()), 200

    elif request.method == 'POST':
        data = request.json
        try:
            data['user_id'] = decode_token(request.cookies['access_token_cookie'])['sub']['id']
        except:
            data['user_id'] = 1
        boards.add(data)
        board = boards.get_all()[-1]
        return jsonify(board), 200


@api_boards.route("/api/boards/<int:board_id>", methods=['GET', 'POST', 'DELETE', 'PATCH'])
def manage_single_board(board_id: int):
    """Manages a single board,
    GET > Returns json with that board id,
    DELETE > Deletes board with that id,
    PATCH > Updates single board

    Args:
        board_id (str): board id

    Returns:
        str or json: json when method GET else feedback, finally status code
    """
    if request.method == 'GET':
        data = boards.get_one_by_id(board_id)
        if data is None or data is False:
            return 'Endpoint not found', 404
        return jsonify(data), 200

    elif request.method == 'DELETE':
        result, response = boards.delete_by_id(board_id)
        return (response, 200) if result else (response, 404)

    elif request.method == 'PATCH':
        result, response = boards.update_by_id(board_id, request.json)
        return (response, 200) if result else (response, 404)


@api_boards.route('/api/boards/<int:board_id>/archived-cards', methods=['GET'])
def manage_archived_cards(board_id: int):
    cards = boards.get_archived_cards(board_id)
    return jsonify(cards), 200
