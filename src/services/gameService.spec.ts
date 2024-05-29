/* eslint-disable no-undef */
import { GameService } from './gameService';
import { GameType } from '../models/game-type';
import { AnimalGameServiceFactory } from './animalGameServiceFactory';
import { FORMIC_ANT_RULES, LONE_ANT_RULES, SPAWNING_ANT_RULES } from '../constants/gameRules';

jest.mock('./animalGameServiceFactory');

describe('GameService', () => {
  let gameService: GameService;

  beforeEach(() => {
    jest.useFakeTimers();
    gameService = GameService.getInstance();
    (AnimalGameServiceFactory.CreateAnimalGameService as jest.Mock).mockClear();
  });

  it('should create a game when AnimalGameService can be created', () => {
    (AnimalGameServiceFactory.CreateAnimalGameService as jest.Mock).mockReturnValue({
      createNewGameBoard: jest.fn().mockReturnValue({ intervalId: setInterval(() => {}, 1000), board: {} })
    });

    const gameId = gameService.createGame(GameType.LoneAnt);

    expect(gameId).toBeDefined();
    expect(gameService.getGameBoard(gameId!)).toBeDefined();
  });

  it('should not create a game when AnimalGameService cannot be created', () => {
    (AnimalGameServiceFactory.CreateAnimalGameService as jest.Mock).mockReturnValue(undefined);

    const gameId = gameService.createGame(GameType.LoneAnt);

    expect(gameId).toBeUndefined();
  });

  it('should delete a game when a valid gameId is provided', () => {
    (AnimalGameServiceFactory.CreateAnimalGameService as jest.Mock).mockReturnValue({
      createNewGameBoard: jest.fn().mockReturnValue({ intervalId: setInterval(() => {}, 1000), board: {} })
    });

    const gameId = gameService.createGame(GameType.LoneAnt);

    gameService.deleteGame(gameId!);

    expect(gameService.getGameBoard(gameId!)).toBeUndefined();
  });

  it('should get the game board when a valid gameId is provided', () => {
    (AnimalGameServiceFactory.CreateAnimalGameService as jest.Mock).mockReturnValue({
      createNewGameBoard: jest.fn().mockReturnValue({ intervalId: setInterval(() => {}, 1000), board: {} })
    });

    const gameId = gameService.createGame(GameType.LoneAnt);

    const gameBoard = gameService.getGameBoard(gameId!);

    expect(gameBoard).toBeDefined();
  });

  it('should get the game status as "Running" when a valid gameId is provided', () => {
    (AnimalGameServiceFactory.CreateAnimalGameService as jest.Mock).mockReturnValue({
      createNewGameBoard: jest.fn().mockReturnValue({ intervalId: setInterval(() => {}, 1000), board: { gameStatus: 'Running' } })
    });

    const gameId = gameService.createGame(GameType.LoneAnt);

    const gameStatus = gameService.getGameStatus(gameId!);

    expect(gameStatus).toBe('Running');
  });

  it('should return undefined when getGameStatus is called with an invalid gameId', () => {
    (AnimalGameServiceFactory.CreateAnimalGameService as jest.Mock).mockReturnValue({
      createNewGameBoard: jest.fn().mockReturnValue({ intervalId: setInterval(() => {}, 1000), board: { gameStatus: 'Running' } })
    });

    const gameStatus = gameService.getGameStatus('invalidId');

    expect(gameStatus).toBe(undefined);
  });

  it('should return all configured game types', () => {
    const expectedGameTypes = [
      {
        gameType: GameType.LoneAnt,
        gameName: 'Lone Ant',
        gameRules: LONE_ANT_RULES
      },
      {
        gameType: GameType.SpawningAnts,
        gameName: 'Spawning Ants',
        gameRules: SPAWNING_ANT_RULES
      },
      {
        gameType: GameType.FormicAnts,
        gameName: 'Formic Ants',
        gameRules: FORMIC_ANT_RULES
      }];
    const gameTypes = gameService.getGameTypes();

    expect(gameTypes).toBeDefined();
    expect(gameTypes.length).toBe(3);

    expectedGameTypes.forEach((expectedGameType, index) => {
      const gameType = gameTypes[index];
      expect(gameType.gameType).toBe(expectedGameType.gameType);
      expect(gameType.gameName).toBe(expectedGameType.gameName);
      expect(gameType.gameRules).toBe(expectedGameType.gameRules);
    });
  });
});
