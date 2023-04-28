export function createBoardTemplate(boardName) {
    return {"title": boardName, "user_id": 1}
}

export function editBoardTitleTemplate(boardTitle) {
    return {"title": boardTitle}
}

export function editColumnTitleTemplate(columnTitle) {
    return  {"title": `${columnTitle}`}
}

export function editCardTitleTemplate(cardTitle) {
    return {"title": `${cardTitle}`}
}
export function createCardTemplate(cardTitle, columnId) {
    return  {"title": `${cardTitle}`, "column_id": `${columnId}`}
}

export function createColumnTemplate(columnTitle, boardId) {
    return {"title": `${columnTitle}`, "board_id": `${boardId}`}
}

export function loginTemplate(login, password) {
    return {"name": `${login}`, "password": `${password}`}
}

export function registerTemplate(login, password) {
    return {"name": `${login}`, "password": `${password}`}
}