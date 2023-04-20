export async function getBoards(){
    const res = await fetch('/api/boards')
    return await res.json()
}

export async function getBoard(boardId){
    const res = await fetch(`/api/boards/${boardId}`)
    return await res.json()
}

export async function deleteBoard(boardId){
    return await fetch(`/api/boards/${boardId}`, {method: 'DELETE'})
}

export async function createBoard(data){
    let res = await fetch('/api/boards', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return await res.json()
}

export async function updateBoard(boardId, data){
    return await fetch(`/api/boards/${boardId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}



