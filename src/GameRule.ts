export interface GameRule<GameState> {
    numPlayer: number;
    getKey: (state: GameState) => string;
    nextPlayer: (player: number) => number;
    prevPlayer: (player: number) => number;
    isEnd: (state: GameState) => boolean;
    getChildren: (state: GameState) => GameState[];
    getRandomChild: (state: GameState) => GameState| undefined;
}

