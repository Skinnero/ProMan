import {dataHandler, apiPost, apiDelete, apiPatch} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import { cardsManager } from "./cardManager.js";
import { editColumnTitleTemplate, createCardTemplate, createColumnTemplate,
        deleteBoardTemplate, deleteColumnTemplate } from "../data/dataTemplates.js";
import { boardsManager } from "./boardsManager.js";

export let columnsManager = {
    loadColumns: async function (boardId) {
        const columns = await dataHandler.getColumnsByBoardId(boardId);
        console.log(columns)
        for (let column of columns) {
            if (column.board_id == boardId) {
                const cardBuilder = htmlFactory(htmlTemplates.column);
                let content = cardBuilder(column);
                domManager.addChild(`.board[data-board-id="${boardId}"]`, content);
                domManager.addEventListener(
                    `h4[data-id="${column.id}"]`,
                    "click",
                    editColumnTitle);
                cardsManager.loadCards(column.id, boardId);
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
    },
};

function deleteButtonHandler(clickEvent) {
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

async function createNewCard (boardId, columnId) {
    let cardName = prompt("Enter card name.")
    await apiPost(`/api/columns/${columnId}/cards`, createCardTemplate(cardName,columnId))
    boardsManager.loadBoards(boardId)
}
async function createNewColumn (boardId) {
    let columnName = prompt("Enter column name.")
    await apiPost(`/api/boards/${boardId}/columns`, createColumnTemplate(columnName, boardId))
    boardsManager.loadBoards(boardId)
}
async function deleteBoard (boardId) {
    await apiDelete(`/api/boards/${boardId}`)
    boardsManager.loadBoards()
}

async function deleteColumn (columnId, boardId) {
    await apiDelete(`/api/columns/${columnId}`)
    boardsManager.loadBoards(boardId)
}

function test (){
    console.log('asdf')
}
function dropHandler(event) {
    event.preventDefault();
    const cardId = event.dataTransfer.getData("text/plain");
    const targetColumn = event.currentTarget;
    const targetColumnId = targetColumn.dataset.columnId;
    const cardElement = document.querySelector(`.card[data-card-id="${cardId}"]`);
    console.log(cardElement)
    targetColumn.appendChild(cardElement);
    apiPost(`/api/cards/${cardId}/update-column`, { column_id: targetColumnId })
}

function dragOverHandler(event) {
    event.preventDefault();
}