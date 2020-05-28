var Ant = require('../models/ant');

const antsDirectory = './ants'

var instance = undefined;

class AntLoaderService {
    
    loadAnts() {
        const path = require('path');
        const fs = require('fs');

        const ants = [];
        const files = fs.readdirSync(antsDirectory);
        files.forEach(file => {
            const data = fs.readFileSync(path.join(antsDirectory, file));
            const newAnt = new Ant();
            newAnt.teamName = file;
            newAnt.doStep = new Function('view', data.toString());
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

module.exports = AntLoaderService;