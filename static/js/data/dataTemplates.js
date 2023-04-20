export function createBoardTemplate(boardName) {
    return {"title": boardName}
}

export function editBoardTitleTemplate(boardTitle) {
    let newNameJson = {"title": `${boardTitle}`}
    return newNameJson
}

export function editColumnTitleTemplate(columnTitle) {
    let newNameJson = {"title": `${columnTitle}`}
    return newNameJson
}

export function editCardTitleTemplate(cardTitle) {
    let newNameJson = {"title": `${cardTitle}`}
    return newNameJson
}
export function createCardTemplate(cardTitle, columnId) {
    let newCartJson = {"title": `${cardTitle}`,
                       "column_id": `${columnId}`}
    return newCartJson
}

export function createColumnTemplate(columnTitle, boardId) {
    let newCartJson = {"title": `${columnTitle}`,
                       "board_id": `${boardId}`}
    return newCartJson
}

export function deleteBoardTemplate(boardId) {
    let newBoardJson = {"boardId": `${boardId}`}
    return newBoardJson
}

export function deleteColumnTemplate(columnId) {
    let newBoardJson = {"boardname": `${columnId}`}
    return newBoardJson
}