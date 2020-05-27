class Board {
    constructor() {
        this.grid = [];
        this.ants = [];
        this.food = [];
    }

    updateBoard(antAction) {
        
    }

    getView(row, col) {
        const tiles = [
            [this.up(row), this.left(col)],
            [this.up(row), col],
            [this.up(row), this.right(col)],
            [row, this.left(col)],
            [row, col],
            [row, this.right(col)],
            [this.down(row), this.left(col)],
            [this.down(row), col],
            [this.down(row), this.right(col)]
        ]

        const view = [];
        const grid = this.grid;
        const food = this.food;
        tiles.forEach(function(tile) {
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

        return view;
    }

    left(col) {
        if (col === 0) {
            return this.grid[0].length - 1;
        } else {
            return col - 1;
        }
    }

    right(col) {
        if (col === this.grid[0].length) {
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
        if (row === this.grid.length) {
            return 0;
        } else {
            return row + 1;
        }
    }
}

module.exports = Board;