import {dataHandler, apiPost, apiDelete, apiPatch} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import { editCardTitleTemplate, createCardTemplate } from "../data/dataTemplates.js";

export let cardsManager = {
    loadCards: async function (columnId, boardId) {
        const cards = await dataHandler.getCardsByBoardId(columnId);
        if (cards) {
            buildCards(cards, columnId)
        }
    },
};

function buildCards(cards, columnId) {
    for (let card of cards) {
        if (columnId == card.column_id) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            let  content = cardBuilder(card);
            domManager.addChild(`.column-content[data-id="${columnId}"]`, content);
            addCartListeners(card.id)
        }
    }
}

function addCartListeners(cardId){
    domManager.addEventListener(
        `h4[data-id="${cardId}"]`,
        "click",
        editCardTitle
    );
    domManager.addEventListener(
        `.delete-card[card-id="${cardId}"]`,
        "click",
        () => deleteCard(cardId))
    dragAndDrop(cardId)
}

function dragAndDrop(cardId) {
    const cardElement = document.querySelector(`.card[data-card-id="${cardId}"]`);
    cardElement.draggable = true;
    cardElement.addEventListener("dragstart", dragStartHandler);
    cardElement.addEventListener("dragend", dragEndHandler);
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
    );
}

function dragStartHandler(event) {
    const cardElement = event.target;
    event.dataTransfer.setData("text/plain", cardElement.dataset.cardId);
}

function dragEndHandler(event) {
    const cardElement = event.target;
    // stary kod drag and drop działa bez ale zostawiam jakby kiedyś przestało
    // cardElement.removeEventListener("dragstart", dragStartHandler);
    // cardElement.removeEventListener("dragend", dragEndHandler);
}

function deleteCard(cardId) {
    apiDelete(`/api/cards/${cardId}`)
    document.querySelector(`.card[data-card-id='${cardId}']`).remove()
}

export async function createNewCard (columnId) {
    let cardName = prompt("Enter card name.")
    await apiPost(`/api/columns/${columnId}/cards`, createCardTemplate(cardName,columnId))
    const cards = await dataHandler.getCardsByBoardId(columnId);
    buildCarts([cards[cards.length - 1]], columnId)
}
