import { AnimalView } from './animal-view';
import { BoardView } from './board-view';
import { AnimalAction } from './animal-action';
import { GameStatus } from './game-status';
import { GameType } from './game-type';
import { Animal } from './animal';

export class Board {
  grid: number[][][] = [];
  animals: Animal[] = [];
  gameStatus: GameStatus =
    {
      gameLength: 0,
      foodLeft: 0,
      elapsedTicks: 0,
      ticksPerSecond: 0
    };

  gameType: GameType = GameType.LoneAnt;

  updateBoard(view: BoardView, animalAction: AnimalAction, animal: Animal) {
    const target = view.tiles[animalAction.cell];
    const targetRow = target[0];
    const targetCol = target[1];
    if (animalAction.color) {
      // Change grid color
      this.grid[targetRow][targetCol][0] = animalAction.color;
    } else {
      // Move animal
      animal.column = targetCol;
      animal.row = targetRow;
    }
  }

  getTiles(row: number, col: number) : number[][] {
    return this.randomizeRotation([
      [this.up(row), this.left(col)],
      [this.up(row), col],
      [this.up(row), this.right(col)],
      [row, this.left(col)],
      [row, col],
      [row, this.right(col)],
      [this.down(row), this.left(col)],
      [this.down(row), col],
      [this.down(row), this.right(col)]
    ]);
  }

  getView(row: number, col: number, name: string): BoardView {
    const tiles = this.getTiles(row, col);

    const view: AnimalView[] = [];
    const grid = this.grid;
    const animals = this.animals;
    tiles.forEach(tile => {
      // tile[0] is row, tile[1] is column
      const viewTile = {
        color: grid[tile[0]][tile[1]][0],
        food: grid[tile[0]][tile[1]][1],
        ant: 0,
        ourFood: 0
      };

      // Find ants around us that aren't us
      if (animals.filter(a => a.name !== name).find(a => a.row === tile[0] && a.column === tile[1])) {
        viewTile.ant = 1;
      }
      view.push(viewTile);
    });

    view[4].ourFood = animals.find(a => a.name === name)?.score || 0;

    return {
      view,
      tiles
    };
  }

  private left(col: number): number {
    return (col - 1 + this.grid[0].length) % this.grid[0].length;
  }

  private right(col: number): number {
    return (col + 1) % this.grid[0].length;
  }

  private up(row: number): number {
    return (row - 1 + this.grid.length) % this.grid.length;
  }

  private down(row: number): number {
    return (row + 1) % this.grid.length;
  }

  // Tiles come to the ants rotated 0, 90, 180, or 270 degrees
  private randomizeRotation(tiles: number[][]): number[][] {
    const random = Math.floor(Math.random() * 4);

    switch (random) {
      case 1:
        return [
          tiles[6], tiles[3], tiles[0],
          tiles[7], tiles[4], tiles[1],
          tiles[8], tiles[5], tiles[2]
        ];
      case 2:
        return [
          tiles[8], tiles[7], tiles[6],
          tiles[5], tiles[4], tiles[3],
          tiles[2], tiles[1], tiles[0]
        ];
      case 3:
        return [
          tiles[2], tiles[5], tiles[8],
          tiles[1], tiles[4], tiles[7],
          tiles[0], tiles[3], tiles[6]
        ];
      default:
        return tiles;
    }
  }
}
