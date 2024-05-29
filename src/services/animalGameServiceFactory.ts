import { GameType } from '../models/game-type';
import { LoneAntAnimalGameService } from './loneAntAnimalGameService';
import { SpawningAntsAnimalGameService } from './spawningAntsAnimalGameService';
import { FormicAntsAnimalGameService } from './formicAntsAnimalGameService';
import { AnimalLoadingService } from './animalLoadingService';

let loneAntInstance: LoneAntAnimalGameService | undefined;
let spawningAntsInstance: SpawningAntsAnimalGameService | undefined;
let formicAntsInstance: FormicAntsAnimalGameService | undefined;

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
}
