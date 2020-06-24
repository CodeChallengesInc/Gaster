import { Game } from '../../models/game';

export interface AnimalGameService {
    createNewGameBoard(): Game;
    createTestGameBoard(antName: string, antCode: string): Game;
}
