export async function getCard(cardId){
    const res = await fetch(`/api/cards/${cardId}`)
    return await res.json()
}

export async function getCardsByColumnId(columnId){
    const res = await fetch(`/api/columns/${columnId}/cards`)
    return await res.json()
}

export async function deleteCard(cardId){
    return await fetch(`/api/cards/${cardId}`, {method: 'DELETE'})
}

export async function createCard(columnId, data){
    const res = fetch(`/api/columns/${columnId}/cards`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return res
}

export async function updateCard(cardId, data){
    const res = fetch(`/api/cards/${cardId}`,{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return res
}

export async function updateCards(columnId, data){
    const res = fetch(`/api/columns/${columnId}/cards`,{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return res
}