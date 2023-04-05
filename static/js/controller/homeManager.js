import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";


export function createBoardButton () {
    const buttonBuilder = htmlFactory(htmlTemplates.buttonBuilder);
    const content = buttonBuilder();
  }