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
      const antName = path.basename(file, path.extname(file));
      const newAnt: Ant = {
        antName,
        column: 0,
        row: 0,
        score: 0,
        error: undefined,
        color: this.generateColor(antName),
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
    return ants;
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

  static getInstance() {
    if (!instance) {
      instance = new AntLoaderService();
    }

    return instance;
  }
}