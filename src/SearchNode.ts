export interface GameRule<GameState> {
    numPlayer: number;
    nextPlayer: (player: number) => number;
    prevPlayer: (player: number) => number;
    isEnd: (state: GameState) => boolean;
    getChildren: (state: GameState) => GameState[];
    getRandomChild: (state: GameState) => GameState| undefined;
}

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

export class MonteCarloSearchGraph<GameState> {
    root: SearchNode<GameState>;
    gameRule: GameRule<GameState>;
    searchDict: Map<GameState, SearchNode<GameState>>;
    constructor(initaialState: GameState, gameRule: GameRule<GameState>) {
        this.gameRule = gameRule;
        this.root = new SearchNode(initaialState, this.gameRule.numPlayer);
        this.searchDict = new Map<GameState, SearchNode<GameState>>();
        this.searchDict.set(initaialState, this.root);
    }

    makeSearchNode(state: GameState): SearchNode<GameState> {
        if (this.searchDict.has(state)) {
            // ?? root is due to typescript compiler bug.
            // It never become nullish but the compiler don't know.
            return this.searchDict.get(state) ?? this.root;
        } else {
            return new SearchNode(state, this.gameRule.numPlayer);
        }
    }

    appendChildren(searchNode: SearchNode<GameState>) {
        const children = this.gameRule.getChildren(searchNode.gameState);
        for (const childState of children) {
            const newNode = this.makeSearchNode(childState);
            searchNode.children.push(newNode);
        }
    }

    getChildUcbScore(parentNode: SearchNode<GameState>, childNode: SearchNode<GameState>) {
        if (childNode.visitCount === 0) {
            return Infinity;
        }
        const confidence = Math.sqrt(2*Math.log2(parentNode.visitCount)/childNode.visitCount)
        const valueScore = childNode.winRate[this.gameRule.prevPlayer(0)]
        return valueScore + confidence;
    }

    getNextNode(parentNode: SearchNode<GameState>): SearchNode<GameState> {
        const ucbList = parentNode.children.map((childNode) => this.getChildUcbScore(parentNode, childNode));
        const maxIdx = ucbList.reduce((maxIdx, curVal, idx, arr) => (arr[maxIdx] < curVal? idx : maxIdx), 0);
        return parentNode.children[maxIdx];
    }

    // return player who win
    randomPlay(state: GameState, player: number): number {
        const childState = this.gameRule.getRandomChild(state);
        if (childState === undefined) {
            return player;
        } else {
            return this.randomPlay(childState, this.gameRule.nextPlayer(player))
        }
    }

    monteCarloSearchRec(curNode: SearchNode<GameState>): number {
        if (curNode.isLeaf()) {
            if (this.gameRule.isEnd(curNode.gameState)) {
                console.log(`Selection (${curNode.gameState}): reached end.`)
                curNode.winCount[0] += 1;
                curNode.visitCount += 1;
                return this.gameRule.nextPlayer(0);
            } else {
                this.appendChildren(curNode);
                console.log(`Expansion (${curNode.gameState})`)
                const winPlayer = this.randomPlay(curNode.gameState, 0);
                console.log(`Rollout (${curNode.gameState}): player ${winPlayer} win`)
                curNode.winCount[winPlayer] += 1;
                curNode.visitCount += 1;
                return this.gameRule.nextPlayer(winPlayer);
            }
        } else {
            const nextNode = this.getNextNode(curNode);
            console.log(`Selection (${curNode.gameState}): search ${nextNode.gameState}`)
            const winPlayer = this.monteCarloSearchRec(nextNode);
            console.log(`Backprop (${curNode.gameState}): player ${winPlayer} win`)
            curNode.winCount[winPlayer] += 1;
            curNode.visitCount += 1;
            return this.gameRule.nextPlayer(winPlayer);
        }
    }

    monteCarloSearch(maxIter: number) {
        for (var iter=0; iter < maxIter; iter++) {
            console.log(`iteration ${iter} ------`)
            this.monteCarloSearchRec(this.root)
        }
        return this.root.children.map((item) => item.winRate)
    }
}

