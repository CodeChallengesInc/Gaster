# Code Challenge Backend

The backend allows users to create and run coding challenge games with participants submitted through the Submission API. So far the only game supposed is the Lone Ant challenge.

A typical use case would look like this:

- Get the config to determine number of ticks, which allows clients to figure out how often to check the game's state
- Create a game using the game POST endpoint
- Poll the GET endpoint based on the number of ticks retrieved from config, updating the UI each time
- Consider DELETEing the game once it's over if you don't need to retain the results

## Environment Configuration

- **GRID_WIDTH**: The width in tiles of the standard game grid. Defaults to 200.
- **GRID_HEIGHT**: The height in tiles of the standard game grid. Defaults to 80.
- **FOOD_PERCENTAGE**: The percentage of the grid that should be populated with food. Defaults to 0.05 (5%)
- **MAX_TICKS**: The number of ticks in a full game. Defaults to 1000.
- **TICKS_PER_SECOND**: The number of times the board updates per second. Defaults to 2.
- **MAX_ANTS**: The number of ants loaded into a challenge. Defaults to 10.

## API Spec

### **board**

GET:

Request:

/board/[gameId]

gameId:

- Guid string
- Received from POST endpoint

Response:

- [Board object](#board-object)

### **game**

POST:

Request:
N/A

Response:

- gameId (guid string)

Notes:
Creates a new game. The gameId can be used to retrieve the current state of the game. gameIds only become invalid after DELETE has been called on it. Games automatically start after this endpoint has been called

DELETE:

Request:

- gameId (guid string)

Response:
N/A

Notes:
Used to stop and delete a game currently in progress. Subsequent GETs to the game endpoint will fail for the given gameId.

### **test**

POST:

Request:

- name (string)
- code (string)

Response:

- gameId (string)

Notes:
Creates a new test game with 1 ant using the code that is passed in through the body of the request (should be a JSON object with a 'code' property). The gameId can be used to retrieve the current state of the game

### **gameStatus**

GET:

Request:

- gameId (guid string)

Response:

- [GameStatus object](#gamestatus-object)

## Response Object Spec

### Board Object

```json
{
    "grid": number[][],      // The grid of tiles, value is 1-8
    "ants": Ant[],           // All the ants currently in the game
    "food": Food[],           // All the food currently present on the board
    "gameStatus": GameStatus // The current status of this game
}
```

### Animal Object

```json
{
    "name": string,  // The name of the animal as defined at creation time
    "column": number,   // The column on the board the animal is at
    "row": number,      // The row on the board the animal is at
    "score": number,    // The current score of the animal, based on food picked up
    "error": string,    // Any error the animal has. If this is true, the animal will no longer be able to play
    "color": string,    // The color of the animal, assigned randomly based on the animal's name
    "creator": string   // The creator of the animal
}
```

### Food Object

```json
{
    "column": number,   // The column on the board the food is at
    "row": number,      // The row on the board the food is at
}
```

### GameStatus Object

```json
{
    "elapsedTicks": number,     // How many ticks have elapsed in this game
    "ticksPerSecond": number,   // How many times this game updates per second
    "gameLength": number,       // How many ticks are in this game
    "foodLeft": number,         // How much food is left in this game
}
```
