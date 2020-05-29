/* eslint-disable */
const ourColor = 8;
const foundTiles = [];
const foundFood = [];

view.forEach((cell, i) => {
  if (cell.color === ourColor) {
    foundTiles.push(i);
  }
  if (cell.food === 1) {
    foundFood.push(i);
  }
});

const cardinals = getCardinalDirections(foundTiles);

// Paint the center if it's not
if (!hasCenter(foundTiles)) {
  return {cell: 4, color: ourColor};
// Grab some food if we have it
} else if (foundFood.length > 0) {
  return {cell: foundFood[0]};
// Walk in a straight line
} else if (cardinals.length === 1) {
  const opposite = getOpposite(cardinals[0]);
  return {cell: opposite};
// Start walking in a new direction
} else if (cardinals.length === 2) {
  if (getOpposite(cardinals[0]) === cardinals[1]) {
    const perp = getPerpendicular(cardinals);
    return {cell: perp};
  } else {
    return {cell: getOpposite(cardinals[0])};
  }
// No idea what happened, go randomly
} else {
  return {cell: 1}
}

function getCardinalDirections(foundTiles) {
  return foundTiles.filter(tile => tile === 1 || tile === 3 || tile === 5 || tile === 7);
}

function hasCenter(foundTiles) {
  return foundTiles.find(tile => tile === 4);
}

function getPerpendicular(cardinals) {
  if (cardinals.find(cardinal => cardinal === 1) && cardinals.find(cardinal => cardinal === 7)) {
    return 3;
  } else if (cardinals.find(cardinal => cardinal === 3) && cardinals.find(cardinal => cardinal === 5)) {
    return 1;
  }

  return 8;
}

function getOpposite(foundIndex) {
  switch (foundIndex) {
    case 1:
      return 7;
    case 7:
      return 1;
    case 3:
      return 5;
    case 5:
      return 3;
    default:
      return 0;
  }
}