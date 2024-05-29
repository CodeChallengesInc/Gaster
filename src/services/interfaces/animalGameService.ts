import { Game } from '../../models/game';

export interface AnimalGameService {
    createNewGameBoard(): Game;
}
