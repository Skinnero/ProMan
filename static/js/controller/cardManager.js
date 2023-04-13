import {dataHandler, apiPost} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import { editCardTitleTemplate } from "../data/dataTemplates.js";

export let cardsManager = {
    loadCards: async function (columnId, boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            if (columnId == card.columnId) {
                const cardBuilder = htmlFactory(htmlTemplates.card);
                let  content = cardBuilder(card);
                domManager.addChild(`.column[column-id="${columnId}"]`, content);
                domManager.addEventListener(
                    `h4[data-card-id="${card.id}"]`,
                    "click",
                    editCardTitle
                );
                const cardDeleteButtonBuilder = htmlFactory(htmlTemplates.deleteCard)
                content = cardDeleteButtonBuilder();
                domManager.addChild(`.card[data-card-id="${card.id}"]`, content);
                const cardElement = document.querySelector(`.card[data-card-id="${card.id}"]`);
                cardElement.draggable = true;
                cardElement.addEventListener("dragstart", dragStartHandler);
                cardElement.addEventListener("dragend", dragEndHandler);
                
            }
        }

    },
};

function editCardTitle (clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const cardTitle = clickEvent.target;
    const input = document.createElement("input")
    input.value = cardTitle.innerText;
    cardTitle.replaceWith(input);
    console.log(boardId)
    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
          const newTitle = input.value;
          input.replaceWith(cardTitle);
          cardTitle.innerText = newTitle;
          apiPost(`/api/${card.id}>`, editCardTitleTemplate(cardTitle))
        }}
    );
}

function test () {
    console.log('asdf')
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