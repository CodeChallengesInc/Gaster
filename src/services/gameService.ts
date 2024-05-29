import { AnimalGameServiceFactory } from './animalGameServiceFactory';
import { Game } from '../models/game';
import { GameType } from '../models/game-type';
import { GameTypeInformation } from '../models/game-type-information';
import * as uuidService from 'uuid';
import { FORMIC_ANT_RULES, LONE_ANT_RULES, SPAWNING_ANT_RULES } from '../constants/gameRules';

// eslint-disable-next-line no-use-before-define
let instance: GameService | undefined;

export class GameService {
  getGameTypes(): GameTypeInformation[] {
    return [
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
      }
    ];
  }

  games: Map<string, Game> = new Map<string, Game>();

  createGame(gameType: GameType) {
    console.log('Creating new Game');
    const animalGameService = AnimalGameServiceFactory.CreateAnimalGameService(gameType);

    const uuid: string = uuidService.v4();

    if (animalGameService !== undefined) {
      this.games.set(uuid, animalGameService.createNewGameBoard());
      return uuid;
    }
    console.error('Could not create game, Game Type not found: ', GameType[gameType]);
    return undefined;
  }

  createTestGame(gameType: GameType, name: string, code: string): string {
    const animalGameService = AnimalGameServiceFactory.CreateAnimalGameService(gameType);

    const uuid: string = uuidService.v4();
    if (animalGameService !== undefined) {
      this.games.set(uuid, animalGameService.createTestGameBoard(name, code));
      return uuid;
    }
    console.error('Could not create game, Game Type not found: ', GameType[gameType]);
    return '';
  }

  private stopGame(game: Game) {
    clearInterval(game.intervalId);
  }

  deleteGame(gameId: string) {
    this.stopGame(this.games.get(gameId)!);
    this.games.delete(gameId);
  }

  getGameBoard(gameId: string) {
    if (!this.games.get(gameId) || !this.games.get(gameId)?.board) {
      return undefined;
    }
    return this.games.get(gameId)!.board;
  }

  getGameStatus(gameId: string) {
    if (!this.games.get(gameId)) {
      return undefined;
    }
    return this.games.get(gameId)!.board.gameStatus;
  }

  static getInstance() {
    if (!instance) {
      console.log('Creating new GameService');
      instance = new GameService();
    }
    return instance;
  }
}
