import { Game } from '../../models/game';

export interface AnimalGameService {
    createNewGameBoard(): Game;
    createTestGameBoard(name: string, antCode: string): Game;
}
