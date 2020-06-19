import { GameType } from '../models/gameType';
import { AntLoaderService } from './interfaces/antLoaderService';
import { LoneAntAntLoaderService } from './loneAntAntLoaderService';

var loneAntInstance: AntLoaderService | undefined;

export class AntLoaderServiceFactory {
  static CreateAntLoaderService(gameType: GameType) {
    if (gameType === GameType.LoneAnt) {
      if (!loneAntInstance) {
        loneAntInstance = new LoneAntAntLoaderService();
      }
      return loneAntInstance;
    }
    return undefined;
  }
}
