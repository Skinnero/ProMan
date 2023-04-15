export async function getCard(cardId){
    const res = await fetch(`/api/cards/${cardId}`)
    return await res.json()
}

export async function getCardsByColumnId(columnId){
    const res = await fetch(`/api/columns/${columnId}/cards`)
    if (res.ok){
        return await res.json()
    } else {
        return false
    }
}

export async function deleteCard(cardId){
    return await fetch(`/api/cards/${cardId}`, {method: 'DELETE'})
}

export async function createCard(columnId, data){
    return await fetch(`/api/columns/${columnId}/cards`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}

export async function updateCard(cardId, data){
    return await fetch(`/api/cards/${cardId}`,{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}

export async function updateCards(columnId, data){
    return await fetch(`/api/columns/${columnId}/cards`,{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}