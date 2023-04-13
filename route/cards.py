from flask import Blueprint, request, jsonify
import data_manager.cards as cards

api_cards = Blueprint('api_cards', __name__)

@api_cards.route('/api/columns/<column_id>/cards', methods=['GET', 'POST', 'PATCH'])
def manage_all_cards_from_column(column_id):
    """Manages all cards that belong to <column_id> column,
    GET > Returns json with all cards,
    POST > Creates new card for that column,
    PATCH > Updates a list of cards if necessery

    Args:
        column_id (str): column id

    Returns:
        str or json: json when methed GET else feedback, finally status code
    """    
    if request.method == 'GET':
        result, data = cards.get_all_by_board_id_by_column_id(column_id)
        return (jsonify(data), 200) if result else (data, 404)
    
    elif request.method == 'POST':
        result, message = cards.add(column_id, request.json)
        return (message, 200) if result else (message, 404)
    
    elif request.method == 'PATCH':
        result, message =  cards.segregate(request.json)
        return (message, 200) if result else (message, 404)

@api_cards.route('/api/cards/<card_id>', methods=['GET','DELETE','PATCH'])
def manage_single_card(card_id):
    """Manages a single card with <card_id>,
    GET > Returns json with that card id,
    DELETE > Deletes card with that id,
    PATCH > Updates single card

    Args:
        card_id (str): card id

    Returns:
        str or json: json when methed GET else feedback, finally status code
    """  
    if request.method == 'GET':
        data = cards.get_one(card_id)
        if data is None or data is False:
            return 'Endpoint not found', 404
        return jsonify(data), 200
    
    elif request.method == 'DELETE':
        result, message = cards.delete_by_id(card_id)
        return (message, 200) if result else (message, 404)
    
    elif request.method == 'PATCH':
        result, message = cards.update_by_id(card_id, request.json)
        return (message, 200) if result else (message, 404)

