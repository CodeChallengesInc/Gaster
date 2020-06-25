import { Ant } from '../models/ant';
import { AnimalGameService } from './interfaces/animalGameService';
import { AnimalAction } from '../models/animal-action';
import { Animal } from '../models/animal';
import { Board } from '../models/board';
import { BoardView } from '../models/board-view';
import { Game } from '../models/game';
import { Food } from '../models/food';

const FOOD_PERCENTAGE = +(process.env.FOOD_PERCENTAGE || 0.05);
const loneAntsDirectory = './ants';
const MAX_ANTS = +(process.env.MAX_ANTS || 10);
const GRID_WIDTH = +(process.env.GRID_WIDTH || 200);
const GRID_HEIGHT = +(process.env.GRID_HEIGHT || 80);
export const TICKS_PER_SECOND = +(process.env.TICKS_PER_SECOND || 10);
export const MAX_TICKS = +(process.env.MAX_TICKS || 1000);
const TEST_GRID_WIDTH = 60;
const TEST_GRID_HEIGHT = 40;
const TEST_TICKS_PER_SECOND = 10;

export class SpawningAntsAnimalGameService implements AnimalGameService {
  loadAnimals(): Animal[] {
    const path = require('path');
    const fs = require('fs');

    var ants: Animal[] = [];
    const files = fs.readdirSync(loneAntsDirectory);
    files.forEach((file: any) => {
      const data = fs.readFileSync(path.join(loneAntsDirectory, file));
      const fileName = path.basename(file, path.extname(file));
      const username = fileName.substring(0, fileName.indexOf('_'));
      const antName = fileName.substring(fileName.indexOf('_') + 1);
      const newAnt = Animal.CreateAnimal(Ant, antName, username, data.toString());
      ants.push(newAnt);
    });

    ants = this.shuffle(ants);

    return ants.slice(0, MAX_ANTS);
  }

  createNewGameBoard() {
    return this.createGame(
      this.loadAnimals(),
      GRID_WIDTH,
      GRID_HEIGHT,
      TICKS_PER_SECOND,
      MAX_TICKS,
      FOOD_PERCENTAGE);
  }

  createTestGameBoard(antName: string, code: string): Game {
    return this.createGame(
      [Animal.CreateAnimal(Ant, antName, 'Tester', code)],
      TEST_GRID_WIDTH,
      TEST_GRID_HEIGHT,
      TEST_TICKS_PER_SECOND,
      MAX_TICKS,
      FOOD_PERCENTAGE);
  }

  private createGame(animals: Animal[], width: number, height: number, ticksPerSecond: number, gameLength: number, foodPercentage: number): Game {
    var board: Board = new Board();
    // Randomize ant starting position
    animals.forEach(ant => {
      ant.row = Math.floor(Math.random() * height);
      ant.column = Math.floor(Math.random() * width);
    });
    board.grid = this.generateGrid(height, width);
    board.animals = animals;
    board.food = this.generateFood(height, width, foodPercentage);
    board.gameStatus =
    {
      gameLength: gameLength,
      foodLeft: board.food.length,
      elapsedTicks: 0,
      ticksPerSecond: ticksPerSecond
    };
    const game: any = {
      board,
      intervalId: undefined
    };

    game.intervalId = setInterval(() => this.tickGame(game, gameLength), 1000 / ticksPerSecond);
    return game;
  }

  // From: https://stackoverflow.com/a/6274381
  private shuffle(array: any[]) {
    var j, x, i;
    for (i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = array[i];
      array[i] = array[j];
      array[j] = x;
    }
    return array;
  }

  generateGrid(height: number, width: number) {
    const newGrid = Array(height).fill([]);
    for (var row = 0; row < height; row++) {
      newGrid[row] = Array(width).fill(1);
    }
    return newGrid;
  }

  generateFood(height: number, width: number, foodPercentage: number) {
    const numFood = Math.floor(width * height * foodPercentage);
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

  private checkErrors(boardView: BoardView, animalAction: AnimalAction | undefined) {
    if (!animalAction) {
      return 'Ant did not return an ant action';
    } else if (animalAction.cell === undefined) {
      return 'Ant did not return a cell';
    } else if (!Number.isInteger(animalAction.cell) || animalAction.cell < 0 || animalAction.cell > 8) {
      return `Cell number '${animalAction.cell}' is not valid`;
    } else if (animalAction.color && (!Number.isInteger(animalAction.color) || animalAction.color < 1 || animalAction.color > 8)) {
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

      var animalAction: AnimalAction | undefined;
      try {
        animalAction = animal.doStep(boardView.view);
        animal.error = this.checkErrors(boardView, animalAction);
      } catch (error) {
        animal.error = error.toString();
      }

      if (!animal.error && animalAction) {
        board.updateBoard(boardView, animalAction, animal);

        // Check for ant walking on food
        var toRemove = -1;
        for (var i = 0; i < board.food.length; i++) {
          const food = board.food[i];
          if (food.row === animal.row && food.column === animal.column) {
            toRemove = i;
            animal.score++;
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
    game.board.gameStatus.gameLength = gameLength;
    if (game.board.gameStatus.elapsedTicks >= gameLength || board.food.length <= 0) {
      clearInterval(game.intervalId);
    }
  }
}
