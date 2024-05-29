/* eslint-disable no-undef */
import { AnimalGameServiceFactory } from './animalGameServiceFactory';
import { LoneAntAnimalGameService } from './loneAntAnimalGameService';
import { SpawningAntsAnimalGameService } from './spawningAntsAnimalGameService';
import { FormicAntsAnimalGameService } from './formicAntsAnimalGameService';
import { GameType } from '../models/game-type';

describe('AnimalGameServiceFactory', () => {
  it('should create a new LoneAntAnimalGameService when gameType is LoneAnt', () => {
    const service = AnimalGameServiceFactory.CreateAnimalGameService(GameType.LoneAnt);
    expect(service).toBeInstanceOf(LoneAntAnimalGameService);
  });

  it('should create a new SpawningAntsAnimalGameService when gameType is SpawningAnts', () => {
    const service = AnimalGameServiceFactory.CreateAnimalGameService(GameType.SpawningAnts);
    expect(service).toBeInstanceOf(SpawningAntsAnimalGameService);
  });

  it('should create a new FormicAntsAnimalGameService when gameType is FormicAnts', () => {
    const service = AnimalGameServiceFactory.CreateAnimalGameService(GameType.FormicAnts);
    expect(service).toBeInstanceOf(FormicAntsAnimalGameService);
  });

  it('should return undefined when gameType is not recognized', () => {
    const service = AnimalGameServiceFactory.CreateAnimalGameService('UnknownGameType' as GameType);
    expect(service).toBeUndefined();
  });
});
