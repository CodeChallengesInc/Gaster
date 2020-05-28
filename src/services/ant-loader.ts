import { Ant } from '../models/ant';

const antsDirectory = './ants';

var instance: AntLoaderService | undefined;

export class AntLoaderService {
  loadAnts(): Ant[] {
    const path = require('path');
    const fs = require('fs');

    const ants: Ant[] = [];
    const files = fs.readdirSync(antsDirectory);
    files.forEach((file: any) => {
      const data = fs.readFileSync(path.join(antsDirectory, file));
      const newAnt = {
        antName: path.basename(file, path.extname(file)),
        column: 0,
        row: 0,
        score: 0,
        // eslint-disable-next-line no-new-func
        doStep: new Function('view', data.toString())
      };
      ants.push(newAnt);
    });
    return ants;
  }

  static getInstance() {
    if (!instance) {
      instance = new AntLoaderService();
    }

    return instance;
  }
}
