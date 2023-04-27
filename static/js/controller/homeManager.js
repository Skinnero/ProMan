import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import { createBoard } from "./boardsManager.js";


export function menuBuilder () {
    const navbarBuilder = htmlFactory(htmlTemplates.navbarBuilder)
    let content = navbarBuilder();
    domManager.addChild("#root", content)
    const sidebarBuilder = htmlFactory(htmlTemplates.sidebarBuilder);
    content = sidebarBuilder();
    domManager.addChild("#root", content);

  }

function menuListeners () {
  domManager.addEventListener(
    `li[data-id='createBoard']`,
    "click",
    createBoard
)

}