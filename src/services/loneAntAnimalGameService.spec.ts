/* eslint-disable no-undef */
import { Animal } from '../models/animal';
import { AnimalAction } from '../models/animal-action';
import { AnimalLoadingService } from './animalLoadingService';
import { LoneAntAnimalGameService } from './loneAntAnimalGameService';

jest.mock('./animalLoadingService', () => {
  return {
    AnimalLoadingService: jest.fn().mockImplementation(() => {
      return { loadAnimals: jest.fn() };
    })
  };
});

describe('LoneAntAnimalGameService', () => {
  let service: LoneAntAnimalGameService;
  let mockAnimalLoadingService: jest.Mocked<AnimalLoadingService>;

  beforeEach(() => {
    mockAnimalLoadingService = new AnimalLoadingService() as jest.Mocked<AnimalLoadingService>;
    service = new LoneAntAnimalGameService(mockAnimalLoadingService);
  });

  it('should create a new game board', () => {
    mockAnimalLoadingService.loadAnimals.mockReturnValue([]);

    const game = service.createNewGameBoard();
    expect(game).toBeDefined();
    expect(game).toHaveProperty('intervalId');
    expect(game).toHaveProperty('board');
  });

  it('should create a game board', () => {
    mockAnimalLoadingService.loadAnimals.mockReturnValue([]);

    const game = service.createNewGameBoard();
    expect(game).toBeDefined();
    expect(game).toHaveProperty('intervalId');
    expect(game).toHaveProperty('board');
  });

  it('should increment elapsedTicks each tick', () => {
    mockAnimalLoadingService.loadAnimals.mockReturnValue([]);

    const game = service.createNewGameBoard();
    const initialTicks = game.board.gameStatus.elapsedTicks;

    service.tickGame(game, 100);

    expect(game.board.gameStatus.elapsedTicks).toBe(initialTicks + 1);
  });

  it('should stop the game when elapsedTicks >= gameLength', () => {
    mockAnimalLoadingService.loadAnimals.mockReturnValue([]);

    const game = service.createNewGameBoard();
    game.board.gameStatus.elapsedTicks = 99;

    jest.spyOn(global, 'clearInterval');
    service.tickGame(game, 100);

    expect(clearInterval).toHaveBeenCalledWith(game.intervalId);
  });

  it('should stop the game when there is no food left', () => {
    mockAnimalLoadingService.loadAnimals.mockReturnValue([]);

    const game = service.createNewGameBoard();
    game.board.gameStatus.foodLeft = 0;

    jest.spyOn(global, 'clearInterval');
    service.tickGame(game, 100);

    expect(clearInterval).toHaveBeenCalledWith(game.intervalId);
  });

  it('should increase the score of an animal if it walks on food', () => {
    mockAnimalLoadingService.loadAnimals.mockReturnValue([new Animal()]);

    const game = service.createNewGameBoard();
    const ant = game.board.animals[0];
    ant.row = 0;
    ant.column = 0;
    game.board.grid[0][0][1] = 1; // Place food at (0, 0)
    const initialScore = ant.score;

    // Mock the doStep method to return an action that doesn't move the ant
    ant.doStep = jest.fn().mockReturnValue({ cell: 4 } as AnimalAction);

    service.tickGame(game, 100);

    expect(ant.score).toBe(initialScore + 1);
  });

  it('should not increase the score of an animal if it does not walk on food', () => {
    mockAnimalLoadingService.loadAnimals.mockReturnValue([new Animal()]);

    const game = service.createNewGameBoard();
    const ant = game.board.animals[0];
    ant.row = 0;
    ant.column = 0;
    game.board.grid[0][0][1] = 0; // No food at (0, 0)
    const initialScore = ant.score;

    // Mock the doStep method to return an action that doesn't move the ant
    ant.doStep = jest.fn().mockReturnValue({ cell: 4 } as AnimalAction);

    service.tickGame(game, 100);

    expect(ant.score).toBe(initialScore);
  });

  it('should set an error on an animal if its doStep method throws an error', () => {
    mockAnimalLoadingService.loadAnimals.mockReturnValue([new Animal()]);

    const game = service.createNewGameBoard();
    const ant = game.board.animals[0];
    const error = 'Test error';

    // Mock the doStep method to throw an error
    ant.doStep = jest.fn().mockImplementation(() => {
      throw new Error(error);
    });

    service.tickGame(game, 100);

    expect(ant.error).toBe(`Error: ${error}`);
  });

  it('should set an error on an animal if it returns an invalid cell number', () => {
    mockAnimalLoadingService.loadAnimals.mockReturnValue([new Animal()]);

    const game = service.createNewGameBoard();
    const ant = game.board.animals[0];

    // Mock the doStep method to return an invalid action
    ant.doStep = jest.fn().mockReturnValue({ cell: 9 } as AnimalAction);

    service.tickGame(game, 100);

    expect(ant.error).toBeTruthy();
  });

  it('should set an error on an animal if it returns undefined', () => {
    mockAnimalLoadingService.loadAnimals.mockReturnValue([new Animal()]);

    const game = service.createNewGameBoard();
    const ant = game.board.animals[0];

    // Mock the doStep method to return an invalid action
    ant.doStep = jest.fn().mockReturnValue(undefined);

    service.tickGame(game, 100);

    expect(ant.error).toBeTruthy();
  });

  it('should set an error on an animal if it returns an undefined cell number', () => {
    mockAnimalLoadingService.loadAnimals.mockReturnValue([new Animal()]);

    const game = service.createNewGameBoard();
    const ant = game.board.animals[0];

    // Mock the doStep method to return an invalid action
    ant.doStep = jest.fn().mockReturnValue({ cell: undefined });

    service.tickGame(game, 100);

    expect(ant.error).toBeTruthy();
  });

  it('should set an error on an animal if it returns an non-numeric color', () => {
    mockAnimalLoadingService.loadAnimals.mockReturnValue([new Animal()]);

    const game = service.createNewGameBoard();
    const ant = game.board.animals[0];

    // Mock the doStep method to return an invalid action
    ant.doStep = jest.fn().mockReturnValue({ cell: 4, color: 'blue' });

    service.tickGame(game, 100);

    expect(ant.error).toBeTruthy();
  });

  it('should set an error on an animal if it returns an numeric color below 0', () => {
    mockAnimalLoadingService.loadAnimals.mockReturnValue([new Animal()]);

    const game = service.createNewGameBoard();
    const ant = game.board.animals[0];

    // Mock the doStep method to return an invalid action
    ant.doStep = jest.fn().mockReturnValue({ cell: 4, color: -1 });

    service.tickGame(game, 100);

    expect(ant.error).toBeTruthy();
  });

  it('should set an error on an animal if it returns an numeric color above 8', () => {
    mockAnimalLoadingService.loadAnimals.mockReturnValue([new Animal()]);

    const game = service.createNewGameBoard();
    const ant = game.board.animals[0];

    // Mock the doStep method to return an invalid action
    ant.doStep = jest.fn().mockReturnValue({ cell: 4, color: 9 });

    service.tickGame(game, 100);

    expect(ant.error).toBeTruthy();
  });
});
