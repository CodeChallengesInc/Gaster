var Board = require('../models/board')
var Food = require('../models/food');

const GRID_WIDTH = 25;
const GRID_HEIGHT = 10;
const FOOD_PERCENTAGE = 0.1;

var instance = undefined;

class GameService {

    constructor() {
        this.uuid = require('uuid');
        this.boards = {};
    }

    createGame() {

        var AntLoaderService = require('./ant-loader');
        var antLoader = AntLoaderService.getInstance();

        const uuid = this.uuid.v4();
        var board = new Board();
        const ants = antLoader.loadAnts();
        
        // Randomize ant starting position
        ants.forEach(ant => {
            ant.row = Math.floor(Math.random() * GRID_HEIGHT);
            ant.column = Math.floor(Math.random() * GRID_WIDTH);
        })
        board.grid = this.generateGrid();
        board.ants = ants;
        board.food = this.generateFood();
        this.boards[uuid] = board;
        setInterval(() => this.tickBoard(board), 1000);
        return uuid;
    }

    tickBoard(board) {
        board.ants.forEach(ant => {
            // Let the ant run its function, then update board based on result
            const antView = board.getView(ant.row, ant.column);
            const antAction = ant.doStep(antView.view);
            board.updateBoard(antView, antAction, ant);

            // Check for ant walking on food
            var toRemove = -1;
            board.food.forEach((food, i) => {
                if (food.row === ant.row && food.column === ant.column) {
                    toRemove = i;
                    ant.score++;
                    return;
                }
            });

            // Only remove food if we found one to remove
            if (toRemove >= 0) {
                board.food.splice(toRemove, 1);
            }
        });
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

    generateFood() {
        const numFood = Math.floor(GRID_WIDTH * GRID_HEIGHT * FOOD_PERCENTAGE);
        const food = [];

        for (var _ of Array(numFood).keys()) {
            const newFood = new Food();
            // Make sure not to generate food on top of already generated food
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