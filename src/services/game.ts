import { Ant } from '../models/ant';
import { Board } from '../models/board';
import { Food } from '../models/food';
import { AntLoaderService } from './ant-loader';
import { AntAction } from '../models/ant-action';
import { Game } from '../models/game';

const GRID_WIDTH = +(process.env.GRID_WIDTH || 200);
const GRID_HEIGHT = +(process.env.GRID_HEIGHT || 80);
const FOOD_PERCENTAGE = +(process.env.FOOD_PERCENTAGE || 0.1);
const MAX_TICKS = 1000;
export const TICKS_PER_SECOND = +(process.env.TICKS_PER_SECOND || 2);

var instance: GameService | undefined;

export class GameService {
    games: any = {};

    createGame() {
      const uuidService = require('uuid');
      var antLoader = AntLoaderService.getInstance();

      const uuid: string = uuidService.v4();
      var board = new Board();
      const ants: Ant[] = antLoader.loadAnts();

      // Randomize ant starting position
      ants.forEach(ant => {
        ant.row = Math.floor(Math.random() * GRID_HEIGHT);
        ant.column = Math.floor(Math.random() * GRID_WIDTH);
      });
      board.grid = this.generateGrid();
      board.ants = ants;
      board.food = this.generateFood();
      const game: any = {
        board,
        intervalId: undefined
      };
      game.intervalId = setInterval(() => this.tickGame(game), 1000 / TICKS_PER_SECOND);
      this.games[uuid] = game;

      return uuid;
    }

    createTestGame(antName: string, code: string): string {
      const uuidService = require('uuid');
      var antLoader = AntLoaderService.getInstance();

      const uuid: string = uuidService.v4();
      var board = new Board();
      const ant = antLoader.loadTestAnt(antName, code);

      // Randomize ant starting position
      ant.row = Math.floor(Math.random() * GRID_HEIGHT);
      ant.column = Math.floor(Math.random() * GRID_WIDTH);
      board.grid = this.generateGrid();
      board.ants = [ant];
      board.food = this.generateFood();
      const game: any = {
        board,
        intervalId: undefined
      };
      game.intervalId = setInterval(() => this.tickGame(game), 1000 / TICKS_PER_SECOND);
      this.games[uuid] = game;

      return uuid;
    }

    tickGame(game: Game) {
      const board = game.board;
      board.ants.filter(ant => !ant.error).forEach(ant => {
        // Let the ant run its function, then update board based on result
        const antView = board.getView(ant.row, ant.column);

        var antAction: AntAction | undefined;
        try {
          antAction = ant.doStep(antView.view);
          ant.error = this.checkErrors(antAction);
        } catch (error) {
          ant.error = error.toString();
        }

        if (!ant.error && antAction) {
          board.updateBoard(antView, antAction, ant);

          // Check for ant walking on food
          var toRemove = -1;
          for (var i = 0; i < board.food.length; i++) {
            const food = board.food[i];
            if (food.row === ant.row && food.column === ant.column) {
              toRemove = i;
              ant.score++;
              break;
            }
          }

          // Only remove food if we found one to remove
          if (toRemove >= 0) {
            board.food.splice(toRemove, 1);
          }
        }
      });

      board.elapsedTicks++;
      if (board.elapsedTicks >= MAX_TICKS || board.food.length <= 0) {
        this.stopGame(game);
      }
    }

    private checkErrors(antAction: AntAction | undefined) {
      if (!antAction) {
        return 'Ant did not return an ant action';
      } else if (antAction.cell === undefined) {
        return 'Ant did not return a cell';
      } else if (!Number.isInteger(antAction.cell) || antAction.cell < 0 || antAction.cell > 8) {
        return `Cell number '${antAction.cell}' is not valid`;
      } else if (antAction.color && (!Number.isInteger(antAction.color) || antAction.color < 1 || antAction.color > 8)) {
        return `Color '${antAction.color}' is not valid`;
      }

      return undefined;
    }

    private stopGame(game: Game) {
      clearInterval(game.intervalId);
    }

    deleteGame(gameId: string) {
      this.stopGame(this.games[gameId]);
      this.games[gameId] = undefined;
    }

    getBoard(gameId: string) {
      if (!this.games[gameId]) {
        return undefined;
      }
      return this.games[gameId].board;
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
      const food: Food[] = [];

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (var junkFood of Array(numFood).keys()) {
        const newFood = {
          column: 0,
          row: 0
        };
        // Make sure not to generate food on top of already generated food
        do {
          newFood.column = Math.floor(Math.random() * GRID_WIDTH);
          newFood.row = Math.floor(Math.random() * GRID_HEIGHT);
        } while (food.find(item => item.column === newFood.column && item.row === newFood.row));
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
