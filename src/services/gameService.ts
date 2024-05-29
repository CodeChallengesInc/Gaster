import { AnimalGameServiceFactory } from './animalGameServiceFactory';
import { Game } from '../models/game';
import { GameType } from '../models/game-type';
import * as uuidService from 'uuid';

// eslint-disable-next-line no-use-before-define
let instance: GameService | undefined;

export class GameService {
  games: Map<string, Game> = new Map<string, Game>();

  createGame(gameType: GameType) {
    console.log('Creating new Game');
    const animalGameService = AnimalGameServiceFactory.CreateAnimalGameService(gameType);

    const uuid: string = uuidService.v4();

    if (animalGameService !== undefined) {
      this.games.set(uuid, animalGameService.createNewGameBoard());
      return uuid;
    }
    // Console.log indicating that the animalGameService could not be created for gameType by enum name
    console.error('animalGameService could not be created for gameType: ', GameType[gameType]);
    return undefined;
  }

  createTestGame(gameType: GameType, animalName: string, code: string): string {
    const animalGameService = AnimalGameServiceFactory.CreateAnimalGameService(gameType);

    const uuid: string = uuidService.v4();
    if (animalGameService !== undefined) {
      this.games.set(uuid, animalGameService.createTestGameBoard(animalName, code));
      return uuid;
    }
    console.error('animalGameService could not be created for gameType: ', GameType[gameType]);
    return '';
  }

  private stopGame(game: Game) {
    clearInterval(game.intervalId);
  }

  deleteGame(gameId: string) {
    this.stopGame(this.games.get(gameId)!);
    this.games.delete(gameId);
    console.log('Game deleted: ', gameId);
  }

  getGameBoard(gameId: string) {
    const game = this.games.get(gameId);
    if (!game || !game.board) {
      console.error('Game Board not found: ', gameId);
      return undefined;
    }
    return this.games.get(gameId)!.board;
  }

  getGameStatus(gameId: string) {
    if (!this.games.get(gameId)) {
      console.error('Game not found: ', gameId);
      return undefined;
    }
    return this.games.get(gameId)!.board.gameStatus;
  }

  static getInstance() {
    if (!instance) {
      console.error('Creating new GameService');
      instance = new GameService();
    }
    return instance;
  }
}
