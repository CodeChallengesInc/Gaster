var Board = require('./models/board');

class Game {
    constructor() {
        this.board = new Board();
        this.board.grid = generateGrid();
        this.board.food = generateFood();
        this.board.ants = loadAnts();
    }

    
}

module.exports = Game;