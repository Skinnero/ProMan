import * as cardsFactory from '../view/html_builders/cardsFactory.mjs'
import { getCardsByColumnId } from '../data_handler/cards.js'

export async function setCardsOnColumns(){
    const columns = document.getElementsByClassName('columns')
    for (const column of columns){
        const cards  = await getCardsByColumnId(column.dataset.id)
        if (!cards){
            column.appendChild(cardsFactory.getAddCardButton(column.dataset.id))
            continue
        }
        for (const card of cards){
            column.appendChild(cardsFactory.getCardDiv(card)) 
        }
        column.appendChild(cardsFactory.getAddCardButton(column.dataset.id))
    }
}