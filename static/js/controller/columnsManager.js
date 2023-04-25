import {dataHandler, apiPost, apiDelete, apiPatch} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import { cardsManager, createNewCard } from "./cardManager.js";
import { editColumnTitleTemplate, createColumnTemplate } from "../data/dataTemplates.js";

export let columnsManager = {
    loadColumns: async function (boardId) {
        const columns = await dataHandler.getColumnsByBoardId(boardId);
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
    dragAndDrop(columnId)
}

function dragAndDrop(columnId) {
    const cardElement = document.querySelector(`.column[data-id="${columnId}"]`);
    cardElement.draggable = true;
    cardElement.addEventListener("dragstart", dragStartHandler);
    cardElement.addEventListener("dragend", dragEndHandler);
}

function editColumnTitle (clickEvent) {
    const boardTitle = clickEvent.target;
    const input = document.createElement("input")
    const columnId = clickEvent.target.dataset.id
    console.log(columnId)
    input.value = boardTitle.innerText;
    boardTitle.replaceWith(input);
    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
          const newTitle = input.value;
          input.replaceWith(boardTitle);
          boardTitle.innerText = newTitle;
          apiPatch(`/api/columns/${columnId}`, editColumnTitleTemplate(newTitle))
        }}
    );
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
    const targetColumnId = targetColumn.dataset.id;
    targetColumn.appendChild(document.querySelector(`.card[data-card-id='${cardId}']`));
    apiPatch(`/api/cards/${cardId}`, { column_id: targetColumnId })
}

function dragOverHandler(event) {
    event.preventDefault();
}

function dragStartHandler(event) {
    const cardElement = event.target;
    event.dataTransfer.setData("text/plain", cardElement.dataset.cardId);
}

function dragEndHandler(event) {
    const cardElement = event.target;
}