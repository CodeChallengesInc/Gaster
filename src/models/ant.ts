import { Animal } from './animal';

export class Ant extends Animal {
  antName!: string;
  name: string;
  column: number;
  row: number;
  score: number;
  error: string | undefined;
  color: string;
  creator: string;
  doStep: Function;
  constructor(name: string, creator: string, code: string) {
    super();
    this.name = name;
    this.antName = name;
    this.column = 0;
    this.row = 0;
    this.score = 0;
    this.error = undefined;
    this.color = this.generateColor(name);
    this.creator = creator;
    // eslint-disable-next-line no-new-func
    this.doStep = new Function('view', '');
    try {
      // eslint-disable-next-line no-new-func
      this.doStep = new Function('view', code);
    } catch (error: any) {
      this.error = error.toString();
    }
  }
}
