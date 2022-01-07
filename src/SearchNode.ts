export class SearchNode<GameState> {
    gameState: GameState;
    rewardCount: number[];
    visitCount: number;
    children: SearchNode<GameState>[];
    constructor (gameState: GameState, numPlayer: number) {
        this.gameState = gameState;
        this.visitCount = 0;
        this.children = [];
        this.rewardCount = new Array(numPlayer).fill(0);
    }

    get rewardRate(): number[] {
        const sum = this.rewardCount.reduce((accum, val) => accum+val);
        return this.rewardCount.map((val) => val/sum);
    }

    addReward(reward: number[]) {
        for (var i=0; i<reward.length; i++) {
            this.rewardCount[i] += reward[i];
        }
        this.visitCount += 1;
    }

    isLeaf() {
        return this.children.length === 0;
    }
}
