import { Animal } from './animal';

export class Ant extends Animal {
  name: string;
  type: number;
  column: number;
  row: number;
  code: string;
  score: number;
  error: string | undefined;
  color: string;
  creator: string;
  declare doStep: Function;
  constructor(name: string, creator: string, code: string, type: number) {
    super();
    this.name = name;
    this.column = 0;
    this.type = type;
    this.row = 0;
    this.score = 0;
    this.error = undefined;
    this.name = name;
    this.color = this.generateColor(name);
    this.code = code;
    this.creator = creator;
    try {
      // eslint-disable-next-line no-new-func
      this.doStep = new Function('view', code);
    } catch (error: any) {
      this.error = error.toString();
    }
  }
}
