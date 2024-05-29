/* eslint-disable no-undef */
import { GameService } from './gameService';
import { GameType } from '../models/game-type';
import { AnimalGameServiceFactory } from './animalGameServiceFactory';

jest.mock('./animalGameServiceFactory');

describe('GameService', () => {
  let gameService: GameService;

  beforeEach(() => {
    jest.useFakeTimers();
    gameService = GameService.getInstance();
    (AnimalGameServiceFactory.CreateAnimalGameService as jest.Mock).mockClear();
  });

  it('creates a game', () => {
    (AnimalGameServiceFactory.CreateAnimalGameService as jest.Mock).mockReturnValue({
      createNewGameBoard: jest.fn().mockReturnValue({ intervalId: setInterval(() => {}, 1000), board: {} }),
    });

    const gameId = gameService.createGame(GameType.LoneAnt);

    expect(gameId).toBeDefined();
    expect(gameService.getGameBoard(gameId!)).toBeDefined();
  });

  it('does not create a game if animalGameService cannot be created', () => {
    (AnimalGameServiceFactory.CreateAnimalGameService as jest.Mock).mockReturnValue(undefined);

    const gameId = gameService.createGame(GameType.LoneAnt);

    expect(gameId).toBeUndefined();
  });

  it('creates a test game', () => {
    (AnimalGameServiceFactory.CreateAnimalGameService as jest.Mock).mockReturnValue({
      createTestGameBoard: jest.fn().mockReturnValue({ intervalId: setInterval(() => {}, 1000), board: {} }),
    });

    const gameId = gameService.createTestGame(GameType.LoneAnt, 'Jenny', '1234');

    expect(gameId).toBeDefined();
    expect(gameService.getGameBoard(gameId!)).toBeDefined();
  });

  it('does not create a test game if animalGameService cannot be created', () => {
    (AnimalGameServiceFactory.CreateAnimalGameService as jest.Mock).mockReturnValue(undefined);

    const gameId = gameService.createTestGame(GameType.LoneAnt, 'Carl', '1234');

    expect(gameId).toBe('');
  });

  it('deletes a game', () => {
    (AnimalGameServiceFactory.CreateAnimalGameService as jest.Mock).mockReturnValue({
      createNewGameBoard: jest.fn().mockReturnValue({ intervalId: setInterval(() => {}, 1000), board: {} }),
    });

    const gameId = gameService.createGame(GameType.LoneAnt);

    gameService.deleteGame(gameId!);

    expect(gameService.getGameBoard(gameId!)).toBeUndefined();
  });

  it('gets the game board', () => {
    (AnimalGameServiceFactory.CreateAnimalGameService as jest.Mock).mockReturnValue({
      createNewGameBoard: jest.fn().mockReturnValue({ intervalId: setInterval(() => {}, 1000), board: {} }),
    });

    const gameId = gameService.createGame(GameType.LoneAnt);

    const gameBoard = gameService.getGameBoard(gameId!);

    expect(gameBoard).toBeDefined();
  });

  it('gets the game status', () => {
    (AnimalGameServiceFactory.CreateAnimalGameService as jest.Mock).mockReturnValue({
      createNewGameBoard: jest.fn().mockReturnValue({ intervalId: setInterval(() => {}, 1000), board: { gameStatus: 'Running' } }),
    });

    const gameId = gameService.createGame(GameType.LoneAnt);

    const gameStatus = gameService.getGameStatus(gameId!);

    expect(gameStatus).toBe('Running');
  });
});