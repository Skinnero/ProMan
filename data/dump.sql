-- DROP CONSTRIANS
ALTER TABLE ONLY users DROP CONSTRAINT IF EXISTS fk_board_id;
ALTER TABLE ONLY board_columns DROP CONSTRAINT IF EXISTS fk_board_id;
ALTER TABLE ONLY cards DROP CONSTRAINT IF EXISTS fk_column_id;

-- CREATE TABLE

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL,
    name text NOT NULL,
    password text NOT NULL,
    board_id INTEGER
);

DROP TABLE IF EXISTS boards;
CREATE TABLE boards (
    id SERIAL PRIMARY KEY NOT NULL,
    name text NOT NULL,
    private bool NOT NULL default false
);

DROP TABLE IF EXISTS board_columns;
CREATE TABLE board_columns (
    id SERIAL PRIMARY KEY NOT NULL,
    name text NOT NULL,
    board_id INTEGER NOT NULL
);

DROP TABLE IF EXISTS cards;
CREATE TABLE cards (
    id SERIAL PRIMARY KEY NOT NULL,
    message text NOT NULL,
    column_id INTEGER NOT NULL
);

-- ADD CONSTRAINTS

ALTER TABLE ONLY users ADD CONSTRAINT fk_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;
ALTER TABLE ONLY board_columns ADD CONSTRAINT fk_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;
ALTER TABLE ONLY cards ADD CONSTRAINT fk_column_id FOREIGN KEY (column_id) REFERENCES board_columns(id) ON DELETE CASCADE;

-- MOCK DATA

INSERT INTO boards(name) VALUES ('project');
INSERT INTO boards(name) VALUES ('test');
INSERT INTO boards(name) VALUES ('random');

INSERT INTO board_columns(name, board_id) VALUES ('Backlog', 1);
INSERT INTO board_columns(name, board_id) VALUES ('TODO', 1);
INSERT INTO board_columns(name, board_id) VALUES ('Backlog', 2);
INSERT INTO board_columns(name, board_id) VALUES ('TODO', 2);
INSERT INTO board_columns(name, board_id) VALUES ('Backlog', 3);
INSERT INTO board_columns(name, board_id) VALUES ('TODO', 3);

INSERT INTO cards(message, column_id) VALUES ('test1', 1);
INSERT INTO cards(message, column_id) VALUES ('test2', 2);
INSERT INTO cards(message, column_id) VALUES ('test3', 3);
INSERT INTO cards(message, column_id) VALUES ('test4', 4);
INSERT INTO cards(message, column_id) VALUES ('test5', 5);
INSERT INTO cards(message, column_id) VALUES ('test6', 6);
