
export interface GameRule<GameState> {
    // Number of players.
    numPlayer: number;
    // initial state
    initialState: GameState;
    // Unique identifier for the game state.
    getKey: (state: GameState) => string;
    // player number on this turn
    getPlayer: (state: GameState) => number;
    // True is the game is end.
    isEnd: (state: GameState) => boolean;
    // Reward of the game end. If not the game is not finished, return zero array.    
    getReward: (state: GameState) => number[];
    // Return complete array consist of the valid moves from the state.
    getChildren: (state: GameState) => GameState[];
    // Return a random valid move from the state. Can be redundant.
    // Return undefined if the game is end so that no more move is available.
    getRandomChild: (state: GameState) => GameState| undefined;
}

