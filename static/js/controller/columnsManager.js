import * as columnsFactory from "../view/html_builders/columnsFactory.mjs"

export async function getColumnsDiv(boardId) {
    const columns = await getColumnsByBoardId(boardId)
    let boardPanel = ``
    for (const columns of columns) {
        boardPanel += columnsFactory
    }
}
