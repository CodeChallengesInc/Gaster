var Board = require('../models/board')
var Food = require('../models/food');
var Ant = require('../models/ant');

const GRID_WIDTH = 25;
const GRID_HEIGHT = 10;
const FOOD_PERCENTAGE = 0.001;

var instance = undefined;

class GameService {

    constructor() {
        this.uuid = require('uuid');
        this.boards = {};
    }

    createGame() {
        const uuid = this.uuid.v4();
        var board = new Board();
        board.grid = this.generateGrid();
        board.ants = this.loadAnts();
        board.food = this.generateFood();
        board.ants[0].doStep = this.dummyAntMethod;
        this.boards[uuid] = board;
        console.log(board.getView(5, 5));
        return uuid;
    }

    tickBoard(board) {
        // for (var ant in board.ants) {
        //     const antView = board.getView(ant.row, ant.column);
        //     const antResult = ant.doStep(antView);
        //     board.updateBoard(antResult);
        // }
    }

    deleteGame(gameId) {
        this.boards[gameId] = undefined;
    }

    getBoard(gameId) {
        return this.boards[gameId];
    }

    generateGrid() {
        const newGrid = Array(GRID_HEIGHT).fill([]);
        for (var row = 0; row < GRID_HEIGHT; row++) {
            newGrid[row] = Array(GRID_WIDTH).fill(1);
        }
        return newGrid;
    }

    loadAnts() {
        return Array(5).fill(new Ant());
    }

    dummyAntMethod(cells) {
        return {
            cell: 4,
            color: 8
        };
    }

    generateFood() {
        const numFood = Math.floor(GRID_WIDTH * GRID_HEIGHT * FOOD_PERCENTAGE);
        const food = [];

        for (var _ of Array(numFood).keys()) {
            const newFood = new Food()
            do {
                newFood.column = Math.floor(Math.random() * GRID_WIDTH);
                newFood.row = Math.floor(Math.random() * GRID_HEIGHT);
            } while(food.find(item => item.column === newFood.column && item.row === newFood.row));
            food.push(newFood);
        }
        
        return food;
    }

    static getInstance() {
        if (!instance) {
            instance = new GameService();
        }

        return instance;
    }
}

module.exports = GameService;