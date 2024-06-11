import { Game } from '../models/game';
import { AnimalGameService } from './interfaces/animalGameService';
import { LoneAntAnimalGameService } from './loneAntAnimalGameService';
import { TICKS_PER_SECOND } from './formicAntsAnimalGameService';

export class LoneAntSocketAnimalGameService implements AnimalGameService {
  private animalLoadingService;
  private loneAntAnimalGameService;
  private socket;

  constructor(animalLoadingService: any, socket: any) {
    this.animalLoadingService = animalLoadingService;
    this.socket = socket;
    this.loneAntAnimalGameService = new LoneAntAnimalGameService(this.animalLoadingService);
  }

  createNewGameBoard(): Game {
    const game = this.loneAntAnimalGameService.createNewGameBoard();
    game.intervalId = setInterval(() => this.broadcastGameState(game), 1000 / TICKS_PER_SECOND);

    return game;
  }

  createNewSimulation(name: string, code: string): Game {
    return this.loneAntAnimalGameService.createNewSimulation(name, code);
  }

  broadcastGameState(game: Game) {
    this.socket.emit('gameStateUpdate', game.board);
  }
}
