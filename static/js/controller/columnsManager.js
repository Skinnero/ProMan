import {dataHandler, apiPost, apiDelete, apiPatch} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
<<<<<<< HEAD
import { cardsManager } from "./cardManager.js";
import { editColumnTitleTemplate, createCardTemplate, createColumnTemplate,} from "../data/dataTemplates.js";
import { boardsManager } from "./boardsManager.js";
=======
import { cardsManager, createNewCard } from "./cardManager.js";
import { editColumnTitleTemplate, createColumnTemplate } from "../data/dataTemplates.js";
>>>>>>> origin/domin

export let columnsManager = {
    loadColumns: async function (boardId) {
        const columns = await dataHandler.getColumnsByBoardId(boardId);
<<<<<<< HEAD
        for (let column of columns) {
            if (column.board_id == boardId) {
                const cardBuilder = htmlFactory(htmlTemplates.column);
                let content = cardBuilder(column);
                domManager.addChild(`.board[data-board-id="${boardId}"]`, content);
                domManager.addEventListener(
                    `h4[data-id="${column.id}"]`,
                    "click",
                    editColumnTitle);
                await cardsManager.loadCards(column.id, boardId);
                const columnDeleteButtonBuilder = htmlFactory(htmlTemplates.deleteColumn)
                content = columnDeleteButtonBuilder(column.id);
                domManager.addChild(`.column[data-id="${column.id}"`, content);
                const cardButtonBuilder = htmlFactory(htmlTemplates.newCard)
                content = cardButtonBuilder(column.id);
                domManager.addChild(`.column[data-id="${column.id}"`, content);
                domManager.addEventListener(
                    `.delete-column[column-id="${column.id}"]`,
                    "click",
                    () => deleteColumn(column.id, boardId));
                domManager.addEventListener(
                    `.column[data-id="${column.id}"]`,
                    "drop",
                    dropHandler
                );
                domManager.addEventListener(
                    `.column[data-id="${column.id}"]`,
                    "dragover",
                    dragOverHandler
                );
                domManager.addEventListener(
                    `.create-new-card[column-id="${column.id}"]`,
                    "click",
                    () => createNewCard(boardId, column.id));
            }
        }
        const columnButtonBuilder = htmlFactory(htmlTemplates.newColumn)
        let content = columnButtonBuilder();
        domManager.addChild(`.board[data-board-id="${boardId}"`, content);
        const boardDeleteButtonBuilder = htmlFactory(htmlTemplates.deleteBoard)
        content = boardDeleteButtonBuilder();
        domManager.addChild(`.board[data-board-id="${boardId}"`, content);
        domManager.addEventListener(
            `.create-new-column`,
            "click",
            () => createNewColumn(boardId));
        domManager.addEventListener(
            `.delete-board`,
            "click",
            () => deleteBoard(boardId));
    }
=======
        buildColumns(columns, boardId)
    },
};

function buildColumns (columns, boardId) {
    for (let column of columns) {
        if (column.board_id == boardId) {
            const columnBuilder = htmlFactory(htmlTemplates.column);
            let content = columnBuilder(column, boardId);
            cardsManager.loadCards(column.id, boardId);
            domManager.addChild(`.board-content[data-board-id='${boardId}']`, content);
            addColumnListeners(column.id, boardId)
        }
    }
    domManager.addEventListener(
        `.create-new-column[data-new-column-board-id="${boardId}"]`,
        "click",
        () => createNewColumn(boardId)
    )
}

function addColumnListeners(columnId, boardId) {
    domManager.addEventListener(
        `h4[data-id="${columnId}"]`,
        "click",
        editColumnTitle);
    domManager.addEventListener(
        `.delete-column[column-id="${columnId}"]`,
        "click",
        () => deleteColumn(columnId, boardId));
    domManager.addEventListener(
        `.column-content[data-id="${columnId}"]`,
        "drop",
        dropHandler
    );
    domManager.addEventListener(
        `.column-content[data-id="${columnId}"]`,
        "dragover",
        dragOverHandler
    );
    domManager.addEventListener(
        `.create-new-card[column-id="${columnId}"]`,
        "click",
        () => createNewCard(columnId));
>>>>>>> origin/domin
}

function editColumnTitle (clickEvent) {
    const boardTitle = clickEvent.target;
    const input = document.createElement("input")
    const columnId = clickEvent.target.dataset.id
    input.value = boardTitle.innerText;
    boardTitle.replaceWith(input);
    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
          const newTitle = input.value;
          input.replaceWith(boardTitle);
          boardTitle.innerText = newTitle;
          apiPatch(`/api/columns/${columnId}`, editColumnTitleTemplate(newTitle))
        }}
    )
}

export async function createNewColumn (boardId) {
    let columnName = prompt("Enter column name.")
    await apiPost(`/api/boards/${boardId}/columns`, createColumnTemplate(columnName, boardId))
    const columns = await dataHandler.getColumnsByBoardId(boardId);
    buildColumns([columns[columns.length - 1]], boardId)
}

async function deleteColumn (columnId) {
    await apiDelete(`/api/columns/${columnId}`)
    document.querySelector(`.column[data-id='${columnId}']`).remove()
}

function dropHandler(event) {
    event.preventDefault();
    const cardId = event.dataTransfer.getData("text/plain");
    const targetColumn = event.currentTarget;
<<<<<<< HEAD
    const targetColumnId = targetColumn.dataset.columnId;
    const cardElement = document.querySelector(`.card[data-card-id="${cardId}"]`);
    targetColumn.appendChild(cardElement);
    apiPost(`/api/cards/${cardId}/update-column`, { column_id: targetColumnId })
=======
    const targetColumnId = targetColumn.dataset.id;
    targetColumn.appendChild(document.querySelector(`.card[data-card-id='${cardId}']`));
    apiPatch(`/api/cards/${cardId}`, { column_id: targetColumnId })
>>>>>>> origin/domin
}

function dragOverHandler(event) {
    event.preventDefault();
}
