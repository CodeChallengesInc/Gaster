import { Game } from '../../models/game';

export interface AnimalGameService {
    createNewGameBoard(): Game;
    createNewSimulation(name: string, antCode: string): Game;
}
