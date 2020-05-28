class Board {
    constructor() {
        this.grid = [];
        this.ants = [];
        this.food = [];
    }

    updateBoard(view, antAction, ant) {
        const target = view.tiles[antAction.cell];
        const targetRow = target[0];
        const targetCol = target[1];
        if (antAction.color) {
            // Change grid color
            this.grid[targetRow][targetCol] = antAction.color;
        } else {
            // Move ant
            ant.column = targetCol;
            ant.row = targetRow;
        }
    }

    getView(row, col) {
        const tiles = this.randomizeRotation([
            [this.up(row), this.left(col)],
            [this.up(row), col],
            [this.up(row), this.right(col)],
            [row, this.left(col)],
            [row, col],
            [row, this.right(col)],
            [this.down(row), this.left(col)],
            [this.down(row), col],
            [this.down(row), this.right(col)]
        ]);

        const view = [];
        const grid = this.grid;
        const food = this.food;
        tiles.forEach(tile => {
            // tile[0] is row, tile[1] is column
            const viewTile = {
                color: grid[tile[0]][tile[1]],
                food: 0
            }

            if (food.find(f => f.row === tile[0] && f.column === tile[1])) {
                viewTile.food = 1;
            }
            view.push(viewTile);
        });

        return {
            view: view,
            tiles: tiles
        };
    }

    left(col) {
        if (col === 0) {
            return this.grid[0].length - 1;
        } else {
            return col - 1;
        }
    }

    right(col) {
        if (col >= this.grid[0].length - 1) {
            return 0;
        } else {
            return col + 1;
        }
    }

    up(row) {
        if (row === 0) {
            return this.grid.length - 1;
        } else {
            return row - 1;
        }
    }

    down(row) {
        if (row >= this.grid.length - 1) {
            return 0;
        } else {
            return row + 1;
        }
    }

    // Tiles come to the ants rotated 0, 90, 180, or 270 degrees
    randomizeRotation(tiles) {
        const random = Math.floor(Math.random() * 4);

        switch (random) {
            case 0:
                return tiles;
            case 1:
                return [
                    tiles[6], tiles[3], tiles[0],
                    tiles[7], tiles[4], tiles[1],
                    tiles[8], tiles[5], tiles[2]
                ];
            case 2:
                return [
                    tiles[8], tiles[7], tiles[6],
                    tiles[5], tiles[4], tiles[3],
                    tiles[2], tiles[1], tiles[0]
                ];
            case 3:
                return [
                    tiles[2], tiles[5], tiles[8],
                    tiles[1], tiles[4], tiles[7],
                    tiles[0], tiles[3], tiles[6]
                ];
        }
    }
}

module.exports = Board;