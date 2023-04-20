from flask import Blueprint, request, jsonify
import data_manager.cards as cards

api_cards = Blueprint('api_cards', __name__)


@api_cards.route('/api/columns/<int:column_id>/cards', methods=['GET', 'POST', 'PATCH'])
def manage_all_cards_from_column(column_id):
    """Manages all cards that belong to <column_id> column,
    GET > Returns json with all cards,
    POST > Creates new card for that column,
    PATCH > Updates a list of cards if necessary

    Args:
        column_id (str): column id

    Returns:
        str or json: json when method GET else feedback, finally status code
    """    
    if request.method == 'GET':
        result, response = cards.get_all_by_column_id(column_id)
        return (jsonify(response), 200) if result else (response, 404)
    
    elif request.method == 'POST':
        result, response = cards.add(column_id, request.json)
        return (response, 200) if result else (response, 404)
    
    elif request.method == 'PATCH':
        result, response = cards.segregate(request.json)
        return (response, 200) if result else (response, 404)


@api_cards.route('/api/cards/<int:card_id>', methods=['GET', 'DELETE', 'PATCH'])
def manage_single_card(card_id):
    """Manages a single card with <card_id>,
    GET > Returns json with that card id,
    DELETE > Deletes card with that id,
    PATCH > Updates single card

    Args:
        card_id (str): card id

    Returns:
        str or json: json when method GET else feedback, finally status code
    """  
    if request.method == 'GET':
        data = cards.get_one(card_id)
        if data is None or data is False:
            return 'Endpoint not found', 404
        return jsonify(data), 200
    
    elif request.method == 'DELETE':
        result, response = cards.delete_by_id(card_id)
        return (response, 200) if result else (response, 404)
    
    elif request.method == 'PATCH':
        result, response = cards.update_by_id(card_id, request.json)
        return (response, 200) if result else (response, 404)
