import {
    TILE_STATUSES,
    createBoard,
    flagTile,
    revealTile,
    checkWin,
    checkLose
} from "./minesweeper.js";

const BOARD_SIZE = { x: 8, y: 6 };
const NUMBER_OF_MINES = 3;


const mineCountElement = document.querySelector('[data-mine-count');
const boardElement = document.querySelector('.board');
const messageText = document.querySelector('.subtext');

boardElement.style.setProperty('--size-x', BOARD_SIZE.x);
boardElement.style.setProperty('--size-y', BOARD_SIZE.y);

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element);
        tile.element.addEventListener('click', () => {
            revealTile(board, tile);
            checkGameEnd();
        });
        tile.element.addEventListener('contextmenu', e => {
            e.preventDefault();
            flagTile(tile);
            listMinesLeft();
            checkGameEnd();
        });
    });
});

mineCountElement.textContent = NUMBER_OF_MINES;

function listMinesLeft() {
    const totalMinesLeft = NUMBER_OF_MINES - board.reduce((minesLeft, row) => {
        return minesLeft + row.reduce((rowMinesFlagged, tile) => {
            if (tile.status === TILE_STATUSES.FLAGGED) {
                return rowMinesFlagged + 1;
            }
            return rowMinesFlagged;
        }, 0);
    }, 0);

    mineCountElement.textContent = totalMinesLeft;
}

function checkGameEnd() {
    const win = checkWin(board);
    const lose = checkLose(board);

    if (win || lose) {
        boardElement.addEventListener('click', stopProp, { capture: true });
        boardElement.addEventListener('contextmenu', stopProp, { capture: true });
    }

    if (win) {
        messageText.textContent = 'You won!';
    }
    if (lose) {
        messageText.textContent = 'You lost!';
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.mine) {
                    if (tile.status === TILE_STATUSES.FLAGGED) {
                        flagTile(tile);
                    }
                    revealTile(board, tile);
                }
            });
        });
    }
}

function stopProp(e) {
    e.stopImmediatePropagation();
}