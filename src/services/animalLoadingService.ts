import { Animal } from '../models/animal';
import { Ant } from '../models/ant';

export class AnimalLoadingService {
  loadAnimals(directory: string, maxAnts: number): Animal[] {
    const path = require('path');
    const fs = require('fs');

    let ants: Animal[] = [];
    const files = fs.readdirSync(directory);
    console.log('Loading Animals from %s', directory);
    files.forEach((file: any) => {
      const data = fs.readFileSync(path.join(directory, file));
      const fileName = path.basename(file, path.extname(file));
      const username = fileName.substring(0, fileName.indexOf('_'));
      const name = fileName.substring(fileName.indexOf('_') + 1);
      ants.push(Animal.CreateAnimal(Ant, name, username, data.toString(), 5));
    });

    ants = this.shuffle(ants);

    return ants.slice(0, maxAnts);
  }

  // From: https://stackoverflow.com/a/6274381
  private shuffle(array: any[]) {
    let j, x, i;
    for (i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = array[i];
      array[i] = array[j];
      array[j] = x;
    }
    return array;
  }
}
