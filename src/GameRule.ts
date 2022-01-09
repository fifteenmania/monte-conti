
export interface GameRule<GameState> {
    // Number of players.
    numPlayer: number;
    // Unique identifier for the game state.
    getKey: (state: GameState) => string;
    // Next player to play if `player` has played on this state.
    // nextPlayer: (state: GameState, player: number) => number;
    // Previous player who played if `player` has played on this state.
   //  prevPlayer: (state: GameState, player: number) => number;
    // True is the game is end.
    isEnd: (state: GameState) => boolean;
    // initial state
    initialState: GameState;
    // Reward of the game end. If not the game is not finished, return zero array.    
    getReward: (state: GameState) => number[];
    // Reward viewed on n turns before.
    getPrevReward: (state: GameState, turns: number) => number[];
    // Return complete array consist of the valid moves from the state.
    getChildren: (state: GameState) => GameState[];
    // Return a random valid move from the state. Can be redundant.
    // Return undefined if the game is end so that no more move is available.
    getRandomChild: (state: GameState) => GameState| undefined;
}

