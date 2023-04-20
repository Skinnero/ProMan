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

export function setCardsOnSingleColumn(column){
    const createCardButton = cardsFactory.getAddCardButton(column.dataset.id)
    column.appendChild(createCardButton)
    return createCardButton
}

export function addSingleCard(card){
    const cardDiv = cardsFactory.getCardDiv(card)
    const columns = document.getElementsByClassName('columns')
    for (const column of columns){
        if (card.column_id == column.dataset.id){
            column.insertBefore(cardDiv, column.getElementsByClassName('add-card')[0])
        }
    }
    return cardDiv
}

export function removeSingleCard(removedCardId){
    const columns = document.getElementsByClassName('columns')
    let cards
    for (const column of columns){
        cards = column.getElementsByClassName('cards')
        for (const card of cards){
            if (card.dataset.id == removedCardId){
                column.removeChild(card)
            }
        }
    }
}