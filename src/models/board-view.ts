import { AnimalView } from './animal-view';

export interface BoardView {
    view: AnimalView[];
    tiles: number[][];
}
