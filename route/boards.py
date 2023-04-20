from flask import Blueprint, jsonify, request
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
        boards.add(request.json)
        board = boards.get_all()[-1]
        print(board)
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


