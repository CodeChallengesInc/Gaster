import { Ant } from '../models/ant';
import { Board } from '../models/board';
import { Food } from '../models/food';
import { AntLoaderServiceFactory } from './antLoaderServiceFactory';
import { AntAction } from '../models/ant-action';
import { Game } from '../models/game';
import { GameType } from '../models/gameType';

const GRID_WIDTH = +(process.env.GRID_WIDTH || 200);
const GRID_HEIGHT = +(process.env.GRID_HEIGHT || 80);
const FOOD_PERCENTAGE = +(process.env.FOOD_PERCENTAGE || 0.05);
export const MAX_TICKS = +(process.env.MAX_TICKS || 1000);
export const TICKS_PER_SECOND = +(process.env.TICKS_PER_SECOND || 10);

const TEST_GRID_WIDTH = 60;
const TEST_GRID_HEIGHT = 40;
const TEST_TICKS_PER_SECOND = 10;

var instance: GameService | undefined;

export class GameService {
    games: any = {};

    createGame(gameType: GameType) {
      const uuidService = require('uuid');
      var antLoader = AntLoaderServiceFactory.CreateAntLoaderService(gameType);

      const uuid: string = uuidService.v4();
      var board = new Board();

      if (antLoader !== undefined) {
        const ants: Ant[] = antLoader.loadAnts();

        // Randomize ant starting position
        ants.forEach(ant => {
          ant.row = Math.floor(Math.random() * GRID_HEIGHT);
          ant.column = Math.floor(Math.random() * GRID_WIDTH);
        });
        board.grid = this.generateGrid(GRID_HEIGHT, GRID_WIDTH);
        board.ants = ants;
        board.food = this.generateFood(GRID_HEIGHT, GRID_WIDTH);
        board.gameStatus =
        {
          gameLength: MAX_TICKS,
          foodLeft: board.food.length,
          elapsedTicks: 0,
          ticksPerSecond: TICKS_PER_SECOND
        };

        const game: any = {
          board,
          intervalId: undefined
        };
        game.intervalId = setInterval(() => this.tickGame(game), 1000 / TICKS_PER_SECOND);
        this.games[uuid] = game;

        return uuid;
      }
      return undefined;
    }

    createTestGame(gameType: GameType, antName: string, code: string): string {
      const uuidService = require('uuid');
      var antLoader = AntLoaderServiceFactory.CreateAntLoaderService(gameType);

      const uuid: string = uuidService.v4();
      var board = new Board();
      if (antLoader !== undefined) {
        const ant = antLoader.loadTestAnt(antName, code);

        // Randomize ant starting position
        ant.row = Math.floor(Math.random() * TEST_GRID_HEIGHT);
        ant.column = Math.floor(Math.random() * TEST_GRID_WIDTH);
        board.grid = this.generateGrid(TEST_GRID_HEIGHT, TEST_GRID_WIDTH);
        board.ants = [ant];
        board.food = this.generateFood(TEST_GRID_HEIGHT, TEST_GRID_WIDTH);

        board.gameStatus =
        {
          gameLength: MAX_TICKS,
          foodLeft: board.food.length,
          elapsedTicks: 0,
          ticksPerSecond: TICKS_PER_SECOND
        };

        const game: any = {
          board,
          intervalId: undefined
        };

        game.intervalId = setInterval(() => this.tickGame(game), 1000 / TEST_TICKS_PER_SECOND);
        this.games[uuid] = game;

        return uuid;
      }
      return '';
    }

    tickGame(game: Game) {
      const board = game.board;
      board.ants.filter(ant => !ant.error).forEach(ant => {
        // Let the ant run its function, then update board based on result
        const antView = board.getView(ant.row, ant.column, ant.antName);

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

      game.board.gameStatus.elapsedTicks++;
      game.board.gameStatus.foodLeft = board.food.length;
      game.board.gameStatus.gameLength = MAX_TICKS;
      if (game.board.gameStatus.elapsedTicks >= MAX_TICKS || board.food.length <= 0) {
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

    getGameState(gameId: string) {
      if (!this.games[gameId].board) {
        return undefined;
      }
      return this.games[gameId].board;
    }

    getGameStatus(gameId: string) {
      if (!this.games[gameId]) {
        return undefined;
      }
      return this.games[gameId].board.gameStatus;
    }

    generateGrid(height: number, width: number) {
      const newGrid = Array(height).fill([]);
      for (var row = 0; row < height; row++) {
        newGrid[row] = Array(width).fill(1);
      }
      return newGrid;
    }

    generateFood(height: number, width: number) {
      const numFood = Math.floor(width * height * FOOD_PERCENTAGE);
      const food: Food[] = [];

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (var junkFood of Array(numFood).keys()) {
        const newFood = {
          column: 0,
          row: 0
        };
        // Make sure not to generate food on top of already generated food
        do {
          newFood.column = Math.floor(Math.random() * width);
          newFood.row = Math.floor(Math.random() * height);
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
