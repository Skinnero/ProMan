export const htmlTemplates = {
    board: 1,
    column: 2,
    card: 3,
    buttonBuilder: 4,
    navbarBuilder: 5,
    sidebarBuilder: 6,
    sidebardElementBuilder: 7,
}

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.column]: columnBuilder,
    [htmlTemplates.card]: cardBuilder,
    [htmlTemplates.newBoardButton]: buttonBuilder,
};

export function htmlFactory(template) {
    if (builderFunctions.hasOwnProperty(template)) {
        return builderFunctions[template];
    }

    console.error("Undefined template: " + template);

    return () => {
        return "";
    };
}

function boardBuilder(board) {
    return `<div class="board" data-board-id=${board.id}>
                <div class="board-title" data-board-id=${board.id}>
                    <h3 data-id=${board.id}>${board.title}</h3>
                </div>
                    <div class="board-content" data-board-id=${board.id}>
                </div>
                <div class="board-buttons">
                    <button class="create-new-column" data-new-column-board-id=${board.id}>Create new column</button>
                    <button class="delete-board" data-delete-board-id=${board.id}>Delete board</button>
                </div>
            </div>`;
}

function columnBuilder(column, boardId) {
    return `<div class="column" data-id="${column.id}" data-board-id="${boardId}">
                <div class="column-title" data-id="${column.id}">
                    <h4 data-id=${column.id}>${column.title}</h4>
                </div>
                <div class="column-buttons" data-id="${column.id}">
                    <button class="delete-column" column-id="${column.id}">Delete column</button><br>
                    <button class="create-new-card" column-id="${column.id}">Create new card</button>
                </div>
                <div class="column-content" data-id="${column.id}">
                </div>
            </div>`;
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}" >
                <div class="card-title">
                    <h4 data-id="${card.id}">${card.title}</h4>
                </div>
                <div class="card-buttons" data-card-id="${card.id}">
                    <button class="delete-card" card-id="${card.id}">Delete card</button>
                </div>
            </div>`;
}

function buttonBuilder() {
    return `<button class="create-board-button">Create Board</button>`;
  }
