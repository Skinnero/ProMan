import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import { createBoard } from "./boardsManager.js";

export function createBoardButton () {
    const buttonBuilder = htmlFactory(htmlTemplates.newBoardButton);
    const content = buttonBuilder();
    domManager.addChild("#root", content);
    domManager.addEventListener(
        `.create-board-button`,
        "click",
        createBoard
    )
  }
