# monte-conti
## Description
monte-conti is a typescript based monte-carlo acyclic graph search algorithm for multiplayer games. It can be used in any turn-based strategic multiplayer games.  
It is designed to used for simple webgame AI. Thus, this library includes only a few features for small bundle size, while giving reasonable decisions without any prior knowledge of the game.  
Implementation detailes are followed from *[Enhancements for Multi-Player
Monte-Carlo Tree Search](https://link.springer.com/chapter/10.1007/978-3-642-17928-0_22)* without progresive history improvements. Uses UCT1 based node selection.

## Defining Your Game Rule
### GameState
First, you need to define a game state. It should uniquely identify your game state.  
If your game is a simple number-counting game, then `GameState` is a single number.  
If it is chess game, `GameState` can be a array of numbers, [6, 5, 4, 3, 2, 4, 5, 6, 1, 1, ...] as 6 repesents rook, 5 represents knight, 4 repesents bishop, etc. 

### GameRule
Second, you should define a game rule object that implements `GameRule<GameState>` interface. It consists of following methods.
```js
export interface GameRule<GameState> {
    numPlayer: number;
    initialState: GameState;
    getKey: (state: GameState) => string;
    getPlayer: (state: GameState) => number;
    isEnd: (state: GameState) => boolean;
    getReward: (state: GameState) => number[];
    getChildren: (state: GameState) => GameState[];
    getRandomChild: (state: GameState) => GameState| undefined;
}
```
- `numPlayer: number` is the number of players.
- `initialState: GameState` is the initial state of the game.
- `getKey: (state: GameState) => string` is a hash function for your gameState. It should give unique string for each game state.
- `getPlayer: (state: GameState) => number` gives current player to play. Players are specified as integer 0, 1, 2, ... which is matched to index of the reward array.
- `isEnd: (state: GameState) => boolean` returns true if input gamestate is end of the game. Else, return false.
- `getReward: (state: GameState) => number[]` gives reward of the state for each players. It consist of *[reward for player 0, reward for the player 1, reward for player 2, ...]* 
- `getChildren: (state: GameState) => GameState[]` gives a complete array of the available next game states. 
- `getRandomChild: (state: GameState) => GameState | undefined` gives a random next state. If it is the end of the game so that no more move is available, it returns `undefined`.

## Example Game Rules
### Nim Game
Originally, nim game is a two-player game with pile of objects. Each player can remove 1 to 3 of objects from pile. The player who took last object win the game. You can get more information on [wiki](https://en.wikipedia.org/wiki/Nim).   
Here, we will consider 3-player nim game with only one pile of 31 objects. Each player can remove 1 to 3 objects. Complete code is available in `src/example/NimGameRule.ts`.

#### Rule Definition
We chose the game state as number of obeject removed from pile. Starting from 0, it is incremented 1, 2, or 3 at each turn. If it reach 31, the player who played in that turn earn 1 point. Others get 0 point.
- `numPlayer` is set to 3. This is not hard-coded so that you may choose any number.
- `getKey` simply calls toString method of the state integer.

#### Usage
Assume Ai playes first. From the starting state 0, the AI should decide how many number of objects to remove.   
You should decide how many time it iterates. The strategy become more and more precise as it iterates, but it will comsume time. About thousand iteration was appropriate in this example, with taking less than one second.
```js
// Initialize a monte-carlo search graph for nim game rule starting from 0.
const sg = new MonteCarloSearchGraph(0, nimGameRule);
// iterate 1000 times
const pick = sg.monteCarloSearch(1000);
// prints how many objects it will remove.
console.log(pick);
```
Actually, there is no obvious winning-choice in turn 0 of three player game. Thus, it will give arbitrary number picked from its valid choices.  
However, as the game become near to end, the winning choice become obvious. As a extreme case, if there are only three object left, you should take all of them to win. As a result, the following code will always print 31.
```js
// Initialize a monte-carlo search graph for nim game rule starting from 0.
const sg = new MonteCarloSearchGraph(28, nimGameRule);
// iterate 1000 times
const pick = sg.monteCarloSearch(1000);
// prints how many objects it will remove.
console.log(pick);
```
You can also re-use a graph through the game. You may change search start state via `updateRoot` method. The AI will become smarter over time as you iterate on each turn.
```js
const sg = new MonteCarloSearchGraph(0, nimGameRule);
const pick = sg.monteCarloSearch(1000);
console.log(pick);

// Assume next player picked state 5
sg.updateRoot(5);
const newPick = sg.monteCarloSearch(1000);
console.log(newPick);
```
