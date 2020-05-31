## Spec

### board

GET:

Request:
- gameId (string)

Response:
- A board object

example (2x2 grid):
```
{
    "grid": [
        [3, 0],
        [0, 2]
    ],
    "ants": [
        { 
            "teamName": "My Cool Ant",
            "column": 0,
            "row": 1
        },
        {
            "teamName": "Another Ant",
            "column": 1,
            "row": 1
        }
    ],
    "food": [
        {
            "column": 1,
            "row": 0
        },
        {
            "column": 0,
            "row": 0
        }
    ]
}
```

### game

POST:

Request:
N/A

Response:
- gameId (string)

Notes:
Creates a new game. The gameId can be used to retrieve the current state of the game

DELETE:

Request:
- gameId (string)

Response:
N/A

Notes:
Used to stop a game currently in progress

### test

POST:

Request:
- antName (string)
- code (string)

Response:
- gameId (string)

Notes:
Creates a new test game with 1 ant using the code that is passed in through the body of the request (should be a JSON object with a 'code' property). The gameId can be used to retrieve the current state of the game

### config

GET:

Request:
N/A

Response:
- config object

example:
```
{
    "ticksPerSecond": 10
}
```