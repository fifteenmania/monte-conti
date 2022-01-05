export interface GameRule<GameState> {
    numPlayer: number;
    nextPlayer: (player: number) => number;
    prevPlayer: (player: number) => number;
    isEnd: (state: GameState) => boolean;
    getChildren: (state: GameState) => GameState[];
    getRandomChild: (state: GameState) => GameState | undefined;
}
export declare class SearchNode<GameState> {
    gameState: GameState;
    winCount: number[];
    visitCount: number;
    children: SearchNode<GameState>[];
    constructor(gameState: GameState, numPlayer: number);
    get winRate(): number[];
    isLeaf(): boolean;
}
export declare class MonteCarloSearchGraph<GameState> {
    root: SearchNode<GameState>;
    gameRule: GameRule<GameState>;
    searchDict: Map<GameState, SearchNode<GameState>>;
    constructor(initaialState: GameState, gameRule: GameRule<GameState>);
    makeSearchNode(state: GameState): SearchNode<GameState>;
    appendChildren(searchNode: SearchNode<GameState>): void;
    getChildUcbScore(parentNode: SearchNode<GameState>, childNode: SearchNode<GameState>): number;
    getNextNode(parentNode: SearchNode<GameState>): SearchNode<GameState>;
    randomPlay(state: GameState, player: number): number;
    monteCarloSearchRec(curNode: SearchNode<GameState>): number;
    monteCarloSearch(maxIter: number): void;
}
