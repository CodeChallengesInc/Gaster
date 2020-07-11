import { Ant } from '../models/ant';
import { AnimalGameService } from './interfaces/animalGameService';
import { AnimalAction } from '../models/animal-action';
import { Animal } from '../models/animal';
import { Board } from '../models/board';
import { Game } from '../models/game';

const FOOD_PERCENTAGE = +(process.env.FOOD_PERCENTAGE || 0.05);
const formicAntsDirectory = './ants/FormicAnts';
const MAX_ANTS = +(process.env.MAX_ANTS || 10);
const GRID_WIDTH = +(process.env.GRID_WIDTH || 200);
const GRID_HEIGHT = +(process.env.GRID_HEIGHT || 80);
export const TICKS_PER_SECOND = +(process.env.TICKS_PER_SECOND || 10);
export const MAX_TICKS = +(process.env.MAX_TICKS || 1000);
const TEST_GRID_WIDTH = 60;
const TEST_GRID_HEIGHT = 40;
const TEST_TICKS_PER_SECOND = 10;

export interface FormicAntAction extends AnimalAction {
  type: number | undefined;
}

export interface FormicBoardView {
  view: FormicAnimalView[];
  tiles: number[][];
}

export interface FormicAntView {
  food: number;
  type: number;
  friend: boolean;
}

export interface FormicAnimalView {
  color: number;
  food: number;
  type: number;
  ant?: FormicAntView;
}

export class FormicAntsAnimalGameService implements AnimalGameService {
  loadAnimals(): Animal[] {
    const path = require('path');
    const fs = require('fs');

    var ants: Animal[] = [];
    const files = fs.readdirSync(formicAntsDirectory);
    console.log('Loading Animals from %s', formicAntsDirectory);
    files.forEach((file: any) => {
      const data = fs.readFileSync(path.join(formicAntsDirectory, file));
      const fileName = path.basename(file, path.extname(file));
      const username = fileName.substring(0, fileName.indexOf('_'));
      const name = fileName.substring(fileName.indexOf('_') + 1);
      ants.push(Animal.CreateAnimal(Ant, name, username, data.toString(), 5));
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

  createTestGameBoard(name: string, code: string): Game {
    return this.createGame(
      [Animal.CreateAnimal(Ant, name, 'Tester', code, 5)],
      TEST_GRID_WIDTH,
      TEST_GRID_HEIGHT,
      TEST_TICKS_PER_SECOND,
      MAX_TICKS,
      FOOD_PERCENTAGE);
  }

  private createGame(animals: Animal[], width: number, height: number, ticksPerSecond: number, gameLength: number, foodPercentage: number): Game {
    var board: Board = new Board();
    console.log('Creating new Formic Ants Game width:%s height:%s ticksPerSecond:%s gameLength:%s foodPercentage:%s', width, height, ticksPerSecond, gameLength, foodPercentage);
    // Randomize ant starting position
    animals.forEach(ant => {
      ant.row = Math.floor(Math.random() * height);
      ant.column = Math.floor(Math.random() * width);
    });
    board.gameStatus =
    {
      gameLength: gameLength,
      elapsedTicks: 0,
      foodLeft: 0,
      ticksPerSecond: ticksPerSecond
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

  generateGrid(board: Board, height: number, width: number, foodPercentage: number) {
    board.grid = Array(height).fill([]);
    for (var row = 0; row < height; row++) {
      board.grid[row] = Array(width).fill([]);
      for (var col = 0; col < width; col++) {
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
    for (var foodAdded = 0; foodAdded < numFood;) {
      const row = Math.floor(Math.random() * height);
      const col = Math.floor(Math.random() * width);
      if (board.grid[row][col][1] === 0) {
        board.grid[row][col][1]++;
        foodAdded++;
      }
    }
    board.gameStatus.foodLeft = foodAdded;
  }

  private checkErrors(animal: Animal, boardView: FormicBoardView, animalAction: FormicAntAction | undefined) {
    if (!animalAction) {
      return 'Ant did not return an ant action';
    } else if (animalAction.cell === undefined) {
      return 'Ant did not return a cell';
    } else if (!Number.isInteger(animalAction.cell) || animalAction.cell < 0 || animalAction.cell > 8) {
      return `Cell number '${animalAction.cell}' is not valid`;
    } else if (animalAction.color && (!Number.isInteger(animalAction.color) || animalAction.color < 1 || animalAction.color > 8)) {
      return `Color '${animalAction.color}' is not valid`;
    // } else if (boardView.view[animalAction.cell].ant !== undefined && animalAction.cell !== 4) {
      // return 'Ant stepped on another ant!';
    } else if (animal.score === 0 && animalAction.type !== undefined) {
      return "You don't have enough food to create a new ant!";
    } else if (animal.score < 0) {
      return "You can't have a negative score!";
    }

    return undefined;
  }

  getView(board: Board, row: number, col: number, name: string): FormicBoardView {
    const tiles = board.getTiles(row, col);

    const view: FormicAnimalView[] = [];
    const grid = board.grid;
    const animals = board.animals;
    const thisAnt = animals.find(a => a.row === row && a.column === col) as Ant;
    tiles.forEach(tile => {
      // tile[0] is row, tile[1] is column
      const viewTile: FormicAnimalView = {
        color: grid[tile[0]][tile[1]][0],
        food: grid[tile[0]][tile[1]][1],
        type: thisAnt.type
      };

      // Find ants around us that aren't us
      const currAnt = animals.find(a => a.row === tile[0] && a.column === tile[1]);
      if (currAnt !== undefined) {
        const antView = <FormicAntView> {
          food: currAnt.score,
          type: currAnt.type
        };
        if (currAnt.name === name) {
          antView.friend = true;
          if (currAnt.score > 0 && thisAnt.type === 5 && currAnt.type !== 5) {
            thisAnt.score++;
            currAnt.score--;
          }
        } else {
          antView.friend = false;
        }
        viewTile.ant = antView;
      }
      view.push(viewTile);
    });

    return {
      view: view,
      tiles: tiles
    };
  }

  updateBoard(board: Board, view: FormicBoardView, animalAction: FormicAntAction, animal: Animal) {
    const target = view.tiles[animalAction.cell];
    const targetRow = target[0];
    const targetCol = target[1];
    if (animalAction.type) {
      const newAnt = Animal.CreateAnimal(Ant, animal.name, animal.creator, animal.code, animalAction.type);
      newAnt.row = targetRow;
      newAnt.column = targetCol;
      board.animals.push(newAnt);
      animal.score--;
    } else if (animalAction.color) {
      // Change grid color
      board.grid[targetRow][targetCol][0] = animalAction.color;
    } else {
      // Move animal
      animal.column = targetCol;
      animal.row = targetRow;
    }
  }

  tickGame(game: Game, gameLength: number) {
    const board = game.board;
    board.animals.filter(animal => !animal.error).forEach(animal => {
      // Let the animal run its function, then update board based on result
      const boardView = this.getView(board, animal.row, animal.column, animal.name);

      var animalAction: FormicAntAction | undefined;
      try {
        animalAction = animal.doStep(boardView.view);
        animal.error = this.checkErrors(animal, boardView, animalAction);
      } catch (error) {
        animal.error = error.toString();
      }

      if (!animal.error && animalAction) {
        this.updateBoard(board, boardView, animalAction, animal);

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
