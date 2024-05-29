import { GameType } from '../models/game-type';
import { LoneAntAnimalGameService } from './loneAntAnimalGameService';
import { SpawningAntsAnimalGameService } from './spawningAntsAnimalGameService';

let loneAntInstance: LoneAntAnimalGameService | undefined;
let spawningAntsInstance: SpawningAntsAnimalGameService | undefined;

export class AnimalGameServiceFactory {
  static CreateAnimalGameService(gameType: GameType) {
    if (gameType === GameType.LoneAnt) {
      if (!loneAntInstance) {
        console.log('Creating new LoneAntAnimalGameService');
        loneAntInstance = new LoneAntAnimalGameService();
      }
      return loneAntInstance;
    } else if (gameType === GameType.SpawningAnts) {
      if (!spawningAntsInstance) {
        console.log('Creating new SpawningAntsAnimalGameService');
        spawningAntsInstance = new SpawningAntsAnimalGameService();
      }
      return spawningAntsInstance;
    }
    return undefined;
  }
}
