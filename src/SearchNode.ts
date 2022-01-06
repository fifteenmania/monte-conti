export class SearchNode<GameState> {
    gameState: GameState;
    winCount: number[];
    visitCount: number;
    children: SearchNode<GameState>[];
    constructor (gameState: GameState, numPlayer: number) {
        this.gameState = gameState;
        this.visitCount = 0;
        this.children = [];
        this.winCount = new Array(numPlayer).fill(0);
    }

    get winRate(): number[] {
        const sum = this.winCount.reduce((accum, val) => accum+val);
        return this.winCount.map((val) => val/sum);
    }

    isLeaf() {
        return this.children.length === 0;
    }
}
