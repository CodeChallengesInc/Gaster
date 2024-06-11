import { GameType } from '../models/game-type';
import { LoneAntAnimalGameService } from './loneAntAnimalGameService';
import { SpawningAntsAnimalGameService } from './spawningAntsAnimalGameService';
import { FormicAntsAnimalGameService } from './formicAntsAnimalGameService';
import { AnimalLoadingService } from './animalLoadingService';
import { Socket } from 'socket.io';
import { LoneAntSocketAnimalGameService } from './loneAntSocketAnimalGameService';

let loneAntInstance: LoneAntAnimalGameService | undefined;
let spawningAntsInstance: SpawningAntsAnimalGameService | undefined;
let formicAntsInstance: FormicAntsAnimalGameService | undefined;
let loneAntSocketInstance: LoneAntSocketAnimalGameService | undefined;

export class AnimalGameServiceFactory {
  static CreateAnimalGameService(gameType: GameType) {
    const animalLodingService = new AnimalLoadingService();
    if (gameType === GameType.LoneAnt) {
      if (!loneAntInstance) {
        console.log('Creating new LoneAntAnimalGameService');
        loneAntInstance = new LoneAntAnimalGameService(animalLodingService);
      }
      return loneAntInstance;
    } else if (gameType === GameType.SpawningAnts) {
      if (!spawningAntsInstance) {
        console.log('Creating new SpawningAntsAnimalGameService');
        spawningAntsInstance = new SpawningAntsAnimalGameService(animalLodingService);
      }
      return spawningAntsInstance;
    } else if (gameType === GameType.FormicAnts) {
      if (!formicAntsInstance) {
        console.log('Creating new FormicAntsAnimalGameService');
        formicAntsInstance = new FormicAntsAnimalGameService(animalLodingService);
      }
      return formicAntsInstance;
    }
    return undefined;
  }

  static CreateSocketAnimalGameService(gameType: GameType, socket: Socket) {
    const animalLodingService = new AnimalLoadingService();
    if (gameType === GameType.LoneAnt) {
      if (!loneAntSocketInstance) {
        console.log('Creating new LoneAntAnimalGameService');
        loneAntSocketInstance = new LoneAntSocketAnimalGameService(animalLodingService, socket);
      }
      return loneAntSocketInstance;
    }
    return undefined;
  }
}
