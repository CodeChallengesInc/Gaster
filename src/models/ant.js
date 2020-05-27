class Ant {
    constructor() {
        this.teamName = 'Default name';
        this.column = 0;
        this.row = 0;
    }

    doStep(view) {
        return {
            cell: 4
        };
    }
}

module.exports = Ant;