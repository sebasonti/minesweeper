export const TILE_STATUSES = {
    HIDDEN: 'hidden',
    MINE: 'mine',
    NUMBER: 'number',
    FLAGGED: 'flagged'
};

export function createBoard(boardSize, numberOfMines) {
    const board = [];
    const minePositions = getMinePositions(boardSize, numberOfMines);
    for (let y = 1; y <= boardSize.y; y++) {
        const row = [];
        for (let x = 1; x <= boardSize.x; x++) {
            const element = document.createElement('div');
            element.dataset.status = TILE_STATUSES.HIDDEN;
            const tile = {
                element,
                x,
                y,
                mine: minePositions.some(positionExists.bind(null, { x, y })),
                get status() {
                    return this.element.dataset.status;
                },
                set status(value) {
                    this.element.dataset.status = value;
                }
            };
            row.push(tile);
        }

        board.push(row);
    }
    return board;
}

export function flagTile(tile) {
    if (tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.FLAGGED) return;
    if (tile.status === TILE_STATUSES.HIDDEN) {
        tile.status = TILE_STATUSES.FLAGGED;
    } else {
        tile.status = TILE_STATUSES.HIDDEN;
    }
}

export function revealTile(board, tile) {
    if (tile.status === TILE_STATUSES.HIDDEN) {
        if (tile.mine) {
            tile.status = TILE_STATUSES.MINE;
            return;
        }
        tile.status = TILE_STATUSES.NUMBER;
        const adjacentTiles = getAdjacentTiles(board, tile);
        const adjacentMines = adjacentTiles.filter(t => t.mine);
        if (adjacentMines.length === 0) {
            adjacentTiles.forEach(revealTile.bind(null, board));
        } else {
            tile.element.textContent = adjacentMines.length;
        }
    }
}

function getAdjacentTiles(board, tile) {
    const adjacentTiles = [];
    for (let x = tile.x - 1; x <= tile.x + 1; x++) {
        for (let y = tile.y - 1; y <= tile.y + 1; y++) {
            const adjacentTile = board[y - 1]?.[x - 1];
            if (adjacentTile) adjacentTiles.push(adjacentTile);
        }
    }
    return adjacentTiles;
}

function getMinePositions(boardSize, numberOfMines) {
    const positions = [];

    while (positions.length < numberOfMines) {
        const position = {
            x: randomNumber(1, boardSize.x),
            y: randomNumber(1, boardSize.y)
        };

        if (!positions.some(p => positionExists(p, position))) {
            positions.push(position)
        }
    }

    return positions;
}

function positionExists(a, b) {
    return a.x === b.x && a.y === b.y;
}

function isAdjacent(tileA, tileB) {
    return (
        tileA.x <= tileB.x + 1 &&
        tileA.x >= tileB.x - 1 &&
        tileA.y <= tileB.y + 1 &&
        tileA.y >= tileB.y - 1
    );
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function checkWin(board) {
    return board.every(row => {
        return row.every(tile => {
            const isFlaggedMine = tile.mine && tile.status === TILE_STATUSES.FLAGGED;
            const isNotMine = !tile.mine && tile.status === TILE_STATUSES.NUMBER;
            return isFlaggedMine || isNotMine;
        });
    });
}

export function checkLose(board) {
    return board.some(row => {
        return row.some(tile => tile.status === TILE_STATUSES.MINE);
    });
}