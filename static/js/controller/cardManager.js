import {dataHandler, apiPost, apiDelete, apiPatch} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import { editCardTitleTemplate } from "../data/dataTemplates.js";
import { boardsManager } from "./boardsManager.js";

export let cardsManager = {
    loadCards: async function (columnId, boardId) {
        const cards = await dataHandler.getCardsByBoardId(columnId);
        for (let card of cards) {
            if (columnId == card.column_id) {
                const cardBuilder = htmlFactory(htmlTemplates.card);
                let  content = cardBuilder(card);
                domManager.addChild(`.column[data-id="${columnId}"]`, content);
                domManager.addEventListener(
                    `h4[data-id="${card.id}"]`,
                    "click",
                    editCardTitle
                );
                const cardDeleteButtonBuilder = htmlFactory(htmlTemplates.deleteCard)
                content = cardDeleteButtonBuilder(card.id);
                domManager.addChild(`.card[data-card-id="${card.id}"]`, content);
                domManager.addEventListener(
                    `.delete-card[card-id="${card.id}"]`,
                    "click",
                    () => deleteCard(card.id, columnId, boardId))
                const cardElement = document.querySelector(`.card[data-card-id="${card.id}"]`);
                cardElement.draggable = true;
                cardElement.addEventListener("dragstart", dragStartHandler);
                cardElement.addEventListener("dragend", dragEndHandler);  
            }
        }
    }
}

function editCardTitle (clickEvent) {
    console.log('xD');
    const cardTitle = clickEvent.target;
    const input = document.createElement("input")
    let cardId = clickEvent.target.dataset.id
    input.value = cardTitle.innerText;
    cardTitle.replaceWith(input);
    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            const newTitle = input.value;
            console.log(newTitle)
            input.replaceWith(cardTitle);
            cardTitle.innerText = newTitle;
            apiPatch(`/api/cards/${cardId}`, editCardTitleTemplate(newTitle))
        }}
    )
}

function dragStartHandler(event) {
    const cardElement = event.target;
    event.dataTransfer.setData("text/plain", cardElement.dataset.cardId);
}

function dragEndHandler(event) {
    const cardElement = event.target;
    cardElement.removeEventListener("dragstart", dragStartHandler);
    cardElement.removeEventListener("dragend", dragEndHandler);
}

async function deleteCard(cardId, columnId, boardId) {
    await apiDelete(`/api/cards/${cardId}`)
    boardsManager.loadBoards(boardId)
}
