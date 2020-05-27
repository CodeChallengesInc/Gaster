var Board = require('../models/board')
var Food = require('../models/food');

const GRID_WIDTH = 2500;
const GRID_HEIGHT = 1000;
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
        board.ants = this.generateAnts();
        board.food = this.generateFood();
        this.boards[uuid] = board;
        return uuid;
    }

    deleteGame(gameId) {
        this.boards[gameId] = undefined;
    }

    getBoard(gameId) {
        return this.boards[gameId];
    }

    generateGrid() {
        return Array(GRID_HEIGHT).fill(Array(GRID_WIDTH).fill(0));
    }

    generateAnts() {
        // TODO load ants
        return [];
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