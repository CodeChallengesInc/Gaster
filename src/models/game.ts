import { Board } from './board';
import { GameStatus } from './game-status';

export interface Game {
  board: Board;
  intervalId: any;
  gameStatus: GameStatus;
}
