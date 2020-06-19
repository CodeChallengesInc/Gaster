import { Ant } from '../../models/ant';

export interface AntLoaderService {
    loadAnts(): Ant[];
    loadTestAnt(antName: string, antCode: string): Ant
}
