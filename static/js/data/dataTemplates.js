export function createBoardTemplate(boardName) {
    let newBoardJson = {"boardname": `${boardName}`}
    return newBoardJson
}

export function editBoardTitleTemplate(boardTitle) {
    let newNameJson = {"boardTitle": `${boardTitle}`}
    return newNameJson
}

export function editColumnTitleTemplate(columnTitle) {
    let newNameJson = {"columnTitle": `${columnTitle}`}
    return newNameJson
}

export function editCardTitleTemplate(cardTitle) {
    let newNameJson = {"cardTitle": `${cardTitle}`}
    return newNameJson
}

export function createCardTemplate(cardTitle, boardId) {
    let newCartJson = {"cardTitle": `${cardTitle}`,
                       "boardId": `${boardId}`}
    return newCartJson
}

export function createColumnTemplate(columnTitle, boardId) {
    let newCartJson = {"columnTitle": `${columnTitle}`,
                       "boardId": `${boardId}`}
    return newCartJson
}