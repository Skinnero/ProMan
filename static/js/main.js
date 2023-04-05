import {boardsManager} from "./controller/boardsManager.js";
import {createBoardButton} from "./controller/homeManager.js";

function init() {
    createBoardButton();
    boardsManager.loadBoards();
}

init();
