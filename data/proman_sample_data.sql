-- DROP CONSTRIANS
ALTER TABLE ONLY boards DROP CONSTRAINT IF EXISTS fk_user_id;
ALTER TABLE ONLY columns DROP CONSTRAINT IF EXISTS fk_board_id;
ALTER TABLE ONLY cards DROP CONSTRAINT IF EXISTS fk_column_id;

-- CREATE TABLE

-- DROP TABLE IF EXISTS users;
-- CREATE TABLE users (
--     id SERIAL PRIMARY KEY NOT NULL,
--     title text UNIQUE NOT NULL,
--     password text NOT NULL
-- );

DROP TABLE IF EXISTS boards;
CREATE TABLE boards (
    id SERIAL PRIMARY KEY NOT NULL,
    title text NOT NULL,
    private bool NOT NULL default true
    -- user_id INTEGER
);

DROP TABLE IF EXISTS columns;
CREATE TABLE columns (
    id SERIAL PRIMARY KEY NOT NULL,
    title text NOT NULL,
    order_number INTEGER NOT NULL,
    board_id INTEGER NOT NULL
);


DROP TABLE IF EXISTS cards;
CREATE TABLE cards (
    id SERIAL PRIMARY KEY NOT NULL,
    title text NOT NULL,
    order_number INTEGER NOT NULL,
    completed bool NOT NULL default false,
    archived bool NOT NULL default false,
    column_id INTEGER NOT NULL
);

-- ADD CONSTRAINTS

ALTER TABLE ONLY boards ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE ONLY columns ADD CONSTRAINT fk_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;
ALTER TABLE ONLY cards ADD CONSTRAINT fk_column_id FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE;

-- MOCK DATA
-- INSERT INTO users(title, password) VALUES ('Kacper','xD');
-- INSERT INTO users(title, password) VALUES ('Tomek','xD');
-- INSERT INTO users(title, password) VALUES ('Edek','xD');

INSERT INTO boards(title) VALUES ('project');
INSERT INTO boards(title) VALUES ('test');
INSERT INTO boards(title) VALUES ('random');

INSERT INTO columns(title, order_number, board_id) VALUES ('To do', 1, 1);
INSERT INTO columns(title, order_number, board_id) VALUES ('Additional', 2, 1);
INSERT INTO columns(title, order_number, board_id) VALUES ('Doing', 3, 1);
INSERT INTO columns(title, order_number, board_id) VALUES ('Done', 4, 1);

INSERT INTO cards(title, order_number, column_id) VALUES ('test1', 1, 1);
INSERT INTO cards(title, order_number, column_id) VALUES ('test2', 2, 1);
INSERT INTO cards(title, order_number, column_id) VALUES ('test3', 3, 1);
INSERT INTO cards(title, order_number, column_id) VALUES ('test4', 4, 1);
INSERT INTO cards(title, order_number, column_id) VALUES ('test5', 5, 1);
INSERT INTO cards(title, order_number, column_id) VALUES ('test6', 6, 1);
