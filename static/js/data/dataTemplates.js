export function createBoardTemplate(boardName) {
    let newBoardJson = {"boardname": `${boardName}`}
    return newBoardJson
}

export function editBoardTitleTemplate(boardTitle) {
    let newBoardJson = {"boardTitle": `${boardTitle}`}
    return newBoardJson
}

export function editColumnTitleTemplate(columnTitle) {
    let newColumnJson = {"columnTitle": `${columnTitle}`}
    return newColumnJson
}

export function editCardTitleTemplate(cardTitle) {
    let newCartJson = {"cardTitle": `${cardTitle}`}
    return newCartJson
}