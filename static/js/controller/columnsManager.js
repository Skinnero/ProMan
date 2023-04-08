import {dataHandler, apiPost} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import { cardsManager } from "./cardManager.js";
import { editColumnTitleTemplate } from "../data/dataTemplates.js";

export let columnsManager = {
    loadColumns: async function (boardId) {
        const columns = await dataHandler.getColumnsByBoardId(boardId);
        for (let column of columns) {
            if (column.boardId == boardId) {
                const cardBuilder = htmlFactory(htmlTemplates.column);
                const content = cardBuilder(column);
                domManager.addChild(`.board[data-board-id="${boardId}"]`, content);
                domManager.addEventListener(
                    `h4[column-id="${column.id}"]`,
                    "click",
                    editColumnTitle);
                cardsManager.loadCards(column.id, boardId);
            }
        }
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
    console.log(boardId)
    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
          const newTitle = input.value;
          input.replaceWith(boardTitle);
          boardTitle.innerText = newTitle;
          apiPost(`/api/board/<${boardId}/edittitle>`, editColumnTitleTemplate(boardTitle))
        }}
    );
}