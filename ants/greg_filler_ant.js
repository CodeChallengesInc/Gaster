/* eslint-disable */
const ourColor = 7;
const ourTiles = [];
const emptyTiles = [];
const hostileTiles = [];
const foodTiles = [];

view.forEach((cell, i) => {
  if (cell.food === 1) {
    foodTiles.push(i);
  }
  if (cell.color === ourColor) {
    ourTiles.push(i);
  } else if (cell.color === 1) {
    emptyTiles.push(i);
  } else {
    hostileTiles.push(i);
  }
});

// Paint the center if it's empty
if (emptyTiles.find(tile => tile === 4)) {
  return {cell: 4, color: ourColor};
// Get the foods
} else if (foodTiles.length > 0) {
  return {cell: foodTiles[0]};
// Try to walk on empty squares
} else if (emptyTiles.length > 0) {
  return {cell: emptyTiles[0]};
// Prefer to walk on enemy tiles
} else if (hostileTiles.length > 0) {
  return {cell: hostileTiles[0]};
// Surrounded by our own tiles, walk randomly
} else {
  return {cell: 0};
}
