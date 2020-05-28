var foundIndex = -1;
view.forEach((cell, i) => {
    if (i !== 4 && cell.color === 8) {
        foundIndex = i;
        return;
    }
});
if (view[4].color === 1) {
    return {
        cell: 4,
        color: 8
    };
} else if (foundIndex >= 0) {
    var opposite = 1;
    switch (foundIndex) {
        case 1:
            opposite = 7;
            break;
        case 7:
            opposite = 1;
            break;
        case 3:
            opposite = 5;
            break;
        case 5:
            opposite = 3;
            break;
    }
    return {
        cell: opposite
    };
} else {
    return {
        cell: 1
    };
}