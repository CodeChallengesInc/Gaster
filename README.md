## Spec

### grid

GET:
Request:
- gameId (string)

Response:
- A grid object

example (2x2 grid):
[
    [
        {
            'color': 'red',

        }
    ],
    [

    ]
]

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

### config

GET:
Request:
N/A

Response:
- config object

example:
{
    "ticksPerSecond": 10
}