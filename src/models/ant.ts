export interface Ant {
    antName: string;
    column: number;
    row: number;
    score: number;
    error: string | undefined;
    color: string;

    doStep: Function
}
