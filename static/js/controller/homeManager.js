import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import { apiPost } from "../data/dataHandler.js";
import { createBoardTemplate} from "../data/dataTemplates.js";


export function createBoardButton () {
    const buttonBuilder = htmlFactory(htmlTemplates.newBoardButton);
    const content = buttonBuilder();
    domManager.addChild("#root", content);
    domManager.addEventListener(
        `.create-board-button`,
        "click",
        createBoardAction)
  }

function createBoardAction() {
    let boardName = prompt("Enter board name.")
    const boardBuilder = htmlFactory(htmlTemplates.board);
    const content = boardBuilder(boardName);
    domManager.addChild("#root", content);
    apiPost("/api/createboard", createBoardTemplate(boardName))
}