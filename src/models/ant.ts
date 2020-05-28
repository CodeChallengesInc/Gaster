import { AntView } from "./ant-view";
import { AntAction } from "./ant-action";

export interface Ant {
    teamName: string;
    column: number;
    row: number;
    score: number;
    
    doStep: Function
}
