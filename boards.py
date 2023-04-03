from flask import Blueprint, jsonify
import data_manager.boards as boards

api_boards = Blueprint('api_boards', __name__)


@api_boards.route("/api/boards", methods=['GET'])
def get_all_boards():
    """Return JSON file excrated from db

    Returns:
        jsonify: 
    """
    return jsonify(boards.get_all())

@api_boards.route('/api/boards/<id>/delete', methods=['DELETE'])
def delete_board(id):

    if boards.delete_by_id(id):
        return '', 200
    return 'TypeError: id must be able to convert into int', 404