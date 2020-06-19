import { Ant } from '../models/ant';
import { AntLoaderService } from './interfaces/antLoaderService';

const antsDirectory = './ants';

const MAX_ANTS = +(process.env.MAX_ANTS || 10);

export class LoneAntAntLoaderService implements AntLoaderService {
  loadAnts(): Ant[] {
    const path = require('path');
    const fs = require('fs');

    var ants: Ant[] = [];
    const files = fs.readdirSync(antsDirectory);
    files.forEach((file: any) => {
      const data = fs.readFileSync(path.join(antsDirectory, file));
      const fileName = path.basename(file, path.extname(file));
      const username = fileName.substring(0, fileName.indexOf('_'));
      const antName = fileName.substring(fileName.indexOf('_') + 1);
      const newAnt: Ant = {
        antName,
        column: 0,
        row: 0,
        score: 0,
        error: undefined,
        color: this.generateColor(antName),
        creator: username,
        // eslint-disable-next-line no-new-func
        doStep: new Function('view', '')
      };

      try {
        // eslint-disable-next-line no-new-func
        newAnt.doStep = new Function('view', data.toString());
      } catch (error) {
        newAnt.error = error.toString();
      }

      ants.push(newAnt);
    });

    ants = this.shuffle(ants);

    return ants.slice(0, MAX_ANTS);
  }

  loadTestAnt(antName: string, code: string): Ant {
    const newAnt: Ant = {
      antName,
      column: 0,
      row: 0,
      score: 0,
      error: undefined,
      color: this.generateColor(antName),
      creator: 'Tester',
      // eslint-disable-next-line no-new-func
      doStep: new Function('view', '')
    };

    try {
      // eslint-disable-next-line no-new-func
      newAnt.doStep = new Function('view', code);
    } catch (error) {
      newAnt.error = error.toString();
    }
    return newAnt;
  }

  private generateColor(antName: string) {
    var seed = this.hashString(antName);
    var seedrandom = require('seedrandom');
    const rng = seedrandom(seed);
    const r = Math.floor(rng() * 255);
    const g = Math.floor(rng() * 255);
    const b = Math.floor(rng() * 255);
    return this.rgbToHex(r, g, b);
  }

  // From: https://stackoverflow.com/a/7616484
  private hashString(text: string) {
    var hash = 0;
    var i;
    var chr;
    for (i = 0; i < text.length; i++) {
      chr = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  // From: https://stackoverflow.com/a/5624139
  private rgbToHex(r: number, g: number, b: number) {
    return `#${this.colorToHex(r)}${this.colorToHex(g)}${this.colorToHex(b)}`;
  }

  private colorToHex(c: number) {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }

  // From: https://stackoverflow.com/a/6274381
  private shuffle(array: any[]) {
    var j, x, i;
    for (i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = array[i];
      array[i] = array[j];
      array[j] = x;
    }
    return array;
  }
}
