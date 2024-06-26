import { AnimalGameService } from './interfaces/animalGameService';
import { AnimalAction } from '../models/animal-action';
import { Animal } from '../models/animal';
import { Board } from '../models/board';
import { BoardView } from '../models/board-view';
import { Game } from '../models/game';
import { AnimalLoadingService } from './animalLoadingService';
import { Ant } from '../models/ant';

const FOOD_PERCENTAGE = +(process.env.FOOD_PERCENTAGE || 0.05);
const spawningAntsDirectory = './ants/SpawningAnts';
const MAX_ANTS = +(process.env.MAX_ANTS || 10);
const GRID_WIDTH = +(process.env.GRID_WIDTH || 200);
const GRID_HEIGHT = +(process.env.GRID_HEIGHT || 80);
export const TICKS_PER_SECOND = +(process.env.TICKS_PER_SECOND || 10);
export const MAX_TICKS = +(process.env.MAX_TICKS || 1000);
const TEST_GRID_WIDTH = 60;
const TEST_GRID_HEIGHT = 40;
const TEST_TICKS_PER_SECOND = 10;

export class SpawningAntsAnimalGameService implements AnimalGameService {
  private animalLoadingService: AnimalLoadingService;

  constructor(animalLoadingService: AnimalLoadingService) {
    this.animalLoadingService = animalLoadingService;
  }

  createNewGameBoard() {
    return this.createGame(
      this.animalLoadingService.loadAnimals(spawningAntsDirectory, MAX_ANTS),
      GRID_WIDTH,
      GRID_HEIGHT,
      TICKS_PER_SECOND,
      MAX_TICKS,
      FOOD_PERCENTAGE);
  }

  private createGame(animals: Animal[], width: number, height: number, ticksPerSecond: number, gameLength: number, foodPercentage: number): Game {
    const board: Board = new Board();
    console.log('Creating new Spawning Ants Game width:%s height:%s ticksPerSecond:%s gameLength:%s foodPercentage:%s', width, height, ticksPerSecond, gameLength, foodPercentage);
    // Randomize ant starting position
    animals.forEach(ant => {
      ant.row = Math.floor(Math.random() * height);
      ant.column = Math.floor(Math.random() * width);
    });
    board.gameStatus =
    {
      gameLength,
      elapsedTicks: 0,
      foodLeft: 0,
      ticksPerSecond
    };
    this.generateGrid(board, height, width, foodPercentage);
    board.animals = animals;
    const game: any = {
      board,
      intervalId: undefined
    };

    game.intervalId = setInterval(() => this.tickGame(game, gameLength), 1000 / ticksPerSecond);
    return game;
  }

  createTestGameBoard(name: string, code: string): Game {
    return this.createGame(
      [Animal.CreateAnimal(Ant, name, 'Tester', code, 5)],
      TEST_GRID_WIDTH,
      TEST_GRID_HEIGHT,
      TEST_TICKS_PER_SECOND,
      MAX_TICKS,
      FOOD_PERCENTAGE);
  }

  generateGrid(board: Board, height: number, width: number, foodPercentage: number) {
    board.grid = Array(height).fill([]);
    for (let row = 0; row < height; row++) {
      board.grid[row] = Array(width).fill([]);
      for (let col = 0; col < width; col++) {
        board.grid[row][col] = new Array(2);
        board.grid[row][col][0] = 1;
        board.grid[row][col][1] = 0;
      }
    }
    this.generateFood(board, height, width, foodPercentage);
  }

  generateFood(board: Board, height: number, width: number, foodPercentage: number) {
    const numFood = Math.floor(width * height * foodPercentage);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let foodAdded = 0;
    for (foodAdded; foodAdded < numFood;) {
      const row = Math.floor(Math.random() * height);
      const col = Math.floor(Math.random() * width);
      if (board.grid[row][col][1] === 0) {
        board.grid[row][col][1]++;
        foodAdded++;
      }
    }
    board.gameStatus.foodLeft = foodAdded;
  }

  private checkErrors(boardView: BoardView, animalAction: AnimalAction | undefined) {
    if (!animalAction) {
      return 'Ant did not return an ant action';
    } else if (animalAction.cell === undefined) {
      return 'Ant did not return a cell';
    } else if (!Number.isInteger(animalAction.cell) || animalAction.cell < 0 || animalAction.cell > 8) {
      return `Cell number '${animalAction.cell}' is not valid`;
    } else if (animalAction.color && (!Number.isInteger(animalAction.color) || animalAction.color < 0 || animalAction.color > 8)) {
      return `Color '${animalAction.color}' is not valid`;
    } else if (boardView.view[animalAction.cell].ant > 0) {
      return 'Ant stepped on another ant!';
    }

    return undefined;
  }

  tickGame(game: Game, gameLength: number) {
    const board = game.board;
    board.animals.filter(animal => !animal.error).forEach(animal => {
      // Let the animal run its function, then update board based on result
      const boardView = board.getView(animal.row, animal.column, animal.name);

      let animalAction: AnimalAction | undefined;
      try {
        animalAction = animal.doStep(boardView.view);
        animal.error = this.checkErrors(boardView, animalAction);
      } catch (error: any) {
        animal.error = error.toString();
      }

      if (!animal.error && animalAction) {
        board.updateBoard(boardView, animalAction, animal);

        // Check for ant walking on food
        if (board.grid[animal.row][animal.column][1] === 1) {
          animal.score++;
          board.grid[animal.row][animal.column][1] = 0;
          game.board.gameStatus.foodLeft--;
        }
      }
    });

    game.board.gameStatus.elapsedTicks++;
    game.board.gameStatus.gameLength = gameLength;
    if (game.board.gameStatus.elapsedTicks >= gameLength || board.gameStatus.foodLeft <= 0) {
      clearInterval(game.intervalId);
    }
  }
}
