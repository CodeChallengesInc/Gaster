/* eslint-disable no-undef */
import { FormicAntsAnimalGameService } from './formicAntsAnimalGameService';
import { AnimalLoadingService } from './animalLoadingService';
import { Board } from '../models/board';

jest.mock('./animalLoadingService', () => {
  return {
    AnimalLoadingService: jest.fn().mockImplementation(() => {
      return { loadAnimals: jest.fn() };
    })
  };
});

describe('FormicAntsAnimalGameService', () => {
  let service: FormicAntsAnimalGameService;
  let mockAnimalLoadingService: jest.Mocked<AnimalLoadingService>;

  beforeEach(() => {
    mockAnimalLoadingService = new AnimalLoadingService() as jest.Mocked<AnimalLoadingService>;
    service = new FormicAntsAnimalGameService(mockAnimalLoadingService);
  });

  it('should create a new game board', () => {
    mockAnimalLoadingService.loadAnimals.mockReturnValue([]);

    const game = service.createNewGameBoard();
    expect(game).toBeDefined();
    expect(game.board).toBeInstanceOf(Board);
    expect(game.intervalId).toBeDefined();
  });

  it('should generate a grid for the board', () => {
    const board = new Board();
    service.generateGrid(board, 10, 10, 0.1);
    expect(board.grid).toBeDefined();
    expect(board.grid.length).toBe(10);
    expect(board.grid[0].length).toBe(10);
  });

  it('should generate food on the board', () => {
    const board = new Board();
    service.generateGrid(board, 10, 10, 0.1);
    service.generateFood(board, 10, 10, 0.1);
    expect(board.gameStatus.foodLeft).toBeGreaterThan(0);
  });

  it('should increment elapsedTicks after each tick', () => {
    mockAnimalLoadingService.loadAnimals.mockReturnValue([]);

    const game = service.createNewGameBoard();
    service.tickGame(game, 1000);
    expect(game.board.gameStatus.elapsedTicks).toBe(1);
  });

  it('should set gameLength to the provided value', () => {
    mockAnimalLoadingService.loadAnimals.mockReturnValue([]);

    const game = service.createNewGameBoard();
    service.tickGame(game, 1000);
    expect(game.board.gameStatus.gameLength).toBe(1000);
  });

  it('should stop the game when elapsedTicks equals gameLength', () => {
    mockAnimalLoadingService.loadAnimals.mockReturnValue([]);

    const game = service.createNewGameBoard();
    game.board.gameStatus.elapsedTicks = 999;
    service.tickGame(game, 1000);
    expect(game.intervalId._destroyed).toBeTruthy();
  });

  it('should stop the game when there is no food left', () => {
    mockAnimalLoadingService.loadAnimals.mockReturnValue([]);

    const game = service.createNewGameBoard();
    game.board.gameStatus.foodLeft = 0;
    service.tickGame(game, 1000);
    expect(game.intervalId._destroyed).toBeTruthy();
  });
});
