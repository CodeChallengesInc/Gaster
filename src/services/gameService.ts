import { AnimalGameServiceFactory } from './animalGameServiceFactory';
import { Game } from '../models/game';
import { GameType } from '../models/game-type';

// eslint-disable-next-line no-use-before-define
let instance: GameService | undefined;

export class GameService {
  games: any = {};

  createGame(gameType: GameType) {
    console.log('Creating new Game');
    const uuidService = require('uuid');
    const animalGameService = AnimalGameServiceFactory.CreateAnimalGameService(gameType);

    const uuid: string = uuidService.v4();

    if (animalGameService !== undefined) {
      this.games[uuid] = animalGameService.createNewGameBoard();
      return uuid;
    }
    return undefined;
  }

  createTestGame(gameType: GameType, animalName: string, code: string): string {
    const uuidService = require('uuid');
    const animalGameService = AnimalGameServiceFactory.CreateAnimalGameService(gameType);

    const uuid: string = uuidService.v4();
    if (animalGameService !== undefined) {
      this.games[uuid] = animalGameService.createTestGameBoard(animalName, code);
      return uuid;
    }
    return '';
  }

  private stopGame(game: Game) {
    clearInterval(game.intervalId);
  }

  deleteGame(gameId: string) {
    this.stopGame(this.games[gameId]);
    this.games[gameId] = undefined;
  }

  getGameBoard(gameId: string) {
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

  static getInstance() {
    if (!instance) {
      console.log('Creating new GameService');
      instance = new GameService();
    }
    return instance;
  }
}
