export async function getColumn(columnId){
    const res = await fetch(`/api/columns/${columnId}`)
    return await res.json()
}

export async function getColumnsByBoardId(boardId){
    const res = await fetch(`/api/boards/${boardId}/columns`)
    if (res.ok){
        return await res.json()
    } else {
        return false
    }
}

export async function createColumn(boardId, data){
    const res = await fetch(`/api/boards/${boardId}/columns`,{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return res
}

export async function deleteColumn(columnId){
    return await fetch(`/api/columns/${columnId}`, {method: 'DELETE'})
}

export async function updateColumn(columnId, data){
    const res = await fetch(`/api/columns/${columnId}`, {
        method: 'PATCH',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return res
}

export async function updateColumns(boardId, data){
    const res = await fetch(`/api/boards/${boardId}/columns`, {
        method: 'PATCH',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return res
}