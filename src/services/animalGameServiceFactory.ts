import { GameType } from '../models/game-type';
import { LoneAntAnimalGameService } from './loneAntAnimalGameService';
import { SpawningAntsAnimalGameService } from './spawningAntsAnimalGameService';
import { FormicAntsAnimalGameService } from './formicAntsAnimalGameService';

var loneAntInstance: LoneAntAnimalGameService | undefined;
var spawningAntsInstance: SpawningAntsAnimalGameService | undefined;
var formicAntsInstance: FormicAntsAnimalGameService | undefined;


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
    } else if (gameType === GameType.FormicAnts) {
      if (!formicAntsInstance) {
        console.log('Creating new FormicAntsAnimalGameService');
        formicAntsInstance = new FormicAntsAnimalGameService();
      }
      return formicAntsInstance;
    }
    return undefined;
  }
}
