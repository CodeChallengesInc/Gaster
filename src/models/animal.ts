export interface AnimalConstructor {
    new (name: string, creator: string, code: string): Animal;
}

export class Animal {
    name!: string;
    column!: number;
    row!: number;
    score!: number;
    error: string | undefined;
    color!: string;
    creator!: string;
    doStep!: Function;

    public static CreateAnimal(Ctor: AnimalConstructor, antName: string, creator: string, code: string): Animal {
      return new Ctor(antName, creator, code);
    }

    protected generateColor(antName: string) {
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
}
