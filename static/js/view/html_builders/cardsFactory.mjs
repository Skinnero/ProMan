export function getCardDiv(card){
    const cardDiv = document.createElement('div')
    cardDiv.className = 'cards'
    cardDiv.draggable = true
    cardDiv.appendChild(getCardTextarea(card))
    cardDiv.appendChild(getCardDeleteSpan(card))
    return cardDiv
}

export function getCardTextarea(card){
    const cardTextarea = document.createElement('textarea')
    cardTextarea.dataset.id = card.id
    cardTextarea.value = card.message
    return cardTextarea
}

export function getCardDeleteSpan(card){
    const cardDeleteSpan = document.createElement('span')
    cardDeleteSpan.className = 'delete-card'
    cardDeleteSpan.dataset.id = card.id
    cardDeleteSpan.innerText = 'x'
    return cardDeleteSpan
}

export function getAddCardButton(columnId){
    const cardDiv = document.createElement('div')
    const button = document.createElement('button')
    cardDiv.className = 'cards'
    button.dataset.id = columnId
    button.className = 'create-card'
    button.innerText = 'Add Card'
    cardDiv.appendChild(button)
    return cardDiv
}