/* eslint-disable no-undef */
import { SpawningAntsAnimalGameService } from './spawningAntsAnimalGameService';

jest.mock('./board', () => ({
  getView: jest.fn(),
  updateBoard: jest.fn()
}));

jest.mock('./animal', () => ({
  doStep: jest.fn()
}));

describe('SpawningAntsAnimalGameService', () => {
  let service: SpawningAntsAnimalGameService;

  beforeEach(() => {
    service = new SpawningAntsAnimalGameService();
  });

  describe('tickGame', () => {
    it('should increment elapsedTicks', () => {
      const game = service.createNewGameBoard();

      service.tickGame(game, 10);
      expect(game.board.gameStatus.elapsedTicks).toBe(1);
    });

    it('should call doStep for each animal without an error', () => {
      const mockDoStep = jest.fn();
      const game = {
        board: {
          animals: [
            { error: false, doStep: mockDoStep },
            { error: false, doStep: mockDoStep }
          ],
          gameStatus: {
            elapsedTicks: 0,
            gameLength: 10,
            foodLeft: 5
          }
        }
      };

      service.tickGame(game, 10);
      expect(mockDoStep).toHaveBeenCalledTimes(2);
    });

    it('should not call doStep for animals with an error', () => {
      const mockDoStep = jest.fn();
      const game = {
        board: {
          animals: [
            { error: true, doStep: mockDoStep },
            { error: false, doStep: mockDoStep }
          ],
          gameStatus: {
            elapsedTicks: 0,
            gameLength: 10,
            foodLeft: 5
          }
        }
      };

      service.tickGame(game, 10);
      expect(mockDoStep).toHaveBeenCalledTimes(1);
    });

    it('should update the board if there is no error and an action is returned', () => {
      const mockUpdateBoard = jest.fn();
      const game = {
        board: {
          animals: [
            { error: false, doStep: () => ({}), row: 0, column: 0 }
          ],
          gameStatus: {
            elapsedTicks: 0,
            gameLength: 10,
            foodLeft: 5
          },
          updateBoard: mockUpdateBoard,
          getView: () => ({ view: {} }),
          grid: [[{ 1: 0 }]]
        }
      };

      service.tickGame(game, 10);
      expect(mockUpdateBoard).toHaveBeenCalled();
    });

    it('should increment the score and decrease foodLeft if an animal walks on food', () => {
      const game = {
        board: {
          animals: [
            { error: false, doStep: () => ({}), row: 0, column: 0, score: 0 }
          ],
          gameStatus: {
            elapsedTicks: 0,
            gameLength: 10,
            foodLeft: 5
          },
          updateBoard: jest.fn(),
          getView: () => ({ view: {} }),
          grid: [[{ 1: 1 }]]
        }
      };

      service.tickGame(game, 10);
      expect(game.board.animals[0].score).toBe(1);
      expect(game.board.gameStatus.foodLeft).toBe(4);
    });

    it('should clear the interval if elapsedTicks equals gameLength', () => {
      const mockClearInterval = jest.spyOn(global, 'clearInterval');
      const game = {
        board: {
          animals: [],
          gameStatus: {
            elapsedTicks: 9,
            gameLength: 10,
            foodLeft: 5
          }
        },
        intervalId: setInterval(() => {}, 1000)
      };

      service.tickGame(game, 10);
      expect(mockClearInterval).toHaveBeenCalledWith(game.intervalId);
    });

    it('should clear the interval if foodLeft is 0', () => {
      const mockClearInterval = jest.spyOn(global, 'clearInterval');
      const game = {
        board: {
          animals: [],
          gameStatus: {
            elapsedTicks: 0,
            gameLength: 10,
            foodLeft: 0
          }
        },
        intervalId: setInterval(() => {}, 1000)
      };

      service.tickGame(game, 10);
      expect(mockClearInterval).toHaveBeenCalledWith(game.intervalId);
    });
  });
});
