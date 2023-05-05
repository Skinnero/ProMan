export let dataHandler = {
    getBoards: async function () {
        return await apiGet(`/api/boards`)
    },
    getArchivedCard: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/archived-cards`)
    },
    getColumnsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/columns`)
    },
    getCardsByBoardId: async function (columnId) {
        return await apiGet(`/api/columns/${columnId}/cards`)
    },
    logoutUser: async function () {
        await fetch('/api/users/log-out', {method:'GET'})
        location.reload()
    }
};

async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.ok) {
        return await response.json();
    } else {
        return false
    }
}

export async function apiPost(url, payload) {
    await fetch(url, {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(payload)
    })
}

export async function apiDelete(url) {
    await fetch(url, {method:'DELETE'})
}

export async function apiPatch(url, payload) {
    await fetch(url, {
        method:'PATCH',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(payload)
    })
}