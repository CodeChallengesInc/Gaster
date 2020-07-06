import { Game } from '../../models/game';

export interface AnimalGameService {
    createNewGameBoard(): Game;
    createTestGameBoard(animalName: string, antCode: string): Game;
}
