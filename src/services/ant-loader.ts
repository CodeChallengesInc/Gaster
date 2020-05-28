import { Ant } from "../models/ant";

const antsDirectory = './ants'

var instance: AntLoaderService | undefined = undefined;

class AntLoaderService {
    
    loadAnts(): Ant[] {
        const path = require('path');
        const fs = require('fs');

        const ants: Ant[] = [];
        const files = fs.readdirSync(antsDirectory);
        files.forEach((file: any) => {
            const data = fs.readFileSync(path.join(antsDirectory, file));
            const newAnt = {
                teamName: file,
                column: 0,
                row: 0,
                score: 0,
                doStep: new Function('view', data.toString())
            };
            ants.push(newAnt);
        })
        return ants;
    }

    static getInstance() {
        if (!instance) {
            instance = new AntLoaderService();
        }

        return instance;
    }
}