import {dataHandler, apiPost} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import { cardsManager } from "./cardManager.js";
import { editColumnTitleTemplate, createCardTemplate, createColumnTemplate,
        deleteBoardTemplate, deleteColumnTemplate } from "../data/dataTemplates.js";

export let columnsManager = {
    loadColumns: async function (boardId) {
        const columns = await dataHandler.getColumnsByBoardId(boardId);
        for (let column of columns) {
            if (column.boardId == boardId) {
                const cardBuilder = htmlFactory(htmlTemplates.column);
                let content = cardBuilder(column);
                domManager.addChild(`.board[data-board-id="${boardId}"]`, content);
                domManager.addEventListener(
                    `h4[column-id="${column.id}"]`,
                    "click",
                    editColumnTitle);
                cardsManager.loadCards(column.id, boardId);
                const columnDeleteButtonBuilder = htmlFactory(htmlTemplates.deleteColumn)
                content = columnDeleteButtonBuilder();
                domManager.addChild(`.column[column-id="${column.id}"`, content);
                domManager.addEventListener(
                    `.delete-column`,
                    "click",
                    () => deleteColumn(column.id));
            }
        }
        const cardButtonBuilder = htmlFactory(htmlTemplates.newCard)
        let content = cardButtonBuilder();
        domManager.addChild(`.board[data-board-id="${boardId}"`, content);
        const columnButtonBuilder = htmlFactory(htmlTemplates.newColumn)
        content = columnButtonBuilder();
        domManager.addChild(`.board[data-board-id="${boardId}"`, content);
        const boardDeleteButtonBuilder = htmlFactory(htmlTemplates.deleteBoard)
        content = boardDeleteButtonBuilder();
        domManager.addChild(`.board[data-board-id="${boardId}"`, content);
        domManager.addEventListener(
            `.create-new-card`,
            "click",
            () => createNewCard(boardId));
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
    const boardId = clickEvent.target.dataset.boardId;
    const boardTitle = clickEvent.target;
    const input = document.createElement("input")
    input.value = boardTitle.innerText;
    boardTitle.replaceWith(input);
    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
          const newTitle = input.value;
          input.replaceWith(boardTitle);
          boardTitle.innerText = newTitle;
          apiPost(`/api/board/<${boardId}/edittitle>`, editColumnTitleTemplate(boardTitle))
        }}
    );
}

function createNewCard (boardId) {
    let cardName = prompt("Enter card name.")
    apiPost("/api/createcard", createCardTemplate(cardName,boardId))
}
function createNewColumn (boardId) {
    let columnName = prompt("Enter column name.")
    apiPost("/api/createcolumn", createColumnTemplate(columnName, boardId))
}
function deleteBoard (boardId) {
    apiPost(`/api/board/${boardId}/delete`, deleteBoardTemplate(boardId))
}

function deleteColumn (columnId) {
    apiPost(`/api/column/${columnId}/delete`, deleteColumnTemplate(columnId))
}

function test (){
    console.log('asdf')
}