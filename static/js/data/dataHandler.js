export let dataHandler = {
    getBoards: async function () {
        return await apiGet(`/api/boards`)
    },
    getBoard: async function (boardId) {
        // the board is retrieved and then the callback function is called with the board
        return await apiGet(`/api/boards/${boardId}`);
    },
    getStatuses: async function () {
        // the statuses are retrieved and then the callback function is called with the statuses
    },
    getStatus: async function (statusId) {
        // the status is retrieved and then the callback function is called with the status
    },
    getColumnsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/columns`)
    },
    getCardsByBoardId: async function (columnId) {
        return await apiGet(`/api/columns/${columnId}/cards`)
    },
    getCard: async function (cardId) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: async function (boardTitle) {
        // creates new board, saves it and calls the callback function with its data
    },
    createNewCard: async function (cardTitle, boardId, statusId) {
        // creates new card, saves it and calls the callback function with its data
    },
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

async function apiPut(url) {
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
