import {SearchNode} from './SearchNode'
import {GameRule} from './GameRule'

function findMaxIdx(arr: number[]) {
    const maxValue = arr.reduce((maxVal, curVal) => maxVal < curVal? curVal: maxVal, 0);
    return arr.findIndex((value) => value === maxValue);
}


export class MonteCarloSearchGraph<GameState> {
    root: SearchNode<GameState>;
    gameRule: GameRule<GameState>;
    searchDict: Map<string, SearchNode<GameState>>;
    constructor(initaialState: GameState, gameRule: GameRule<GameState>) {
        this.gameRule = gameRule;
        this.root = new SearchNode(initaialState, this.gameRule.numPlayer);
        this.searchDict = new Map<string, SearchNode<GameState>>();
        this.searchDict.set(gameRule.getKey(initaialState), this.root);
        this.appendChildren(this.root);
    }

    getNode(state: GameState): SearchNode<GameState>|undefined {
        return this.searchDict.get(this.gameRule.getKey(state));
    }

    makeSearchNode(state: GameState): SearchNode<GameState> {
        const key = this.gameRule.getKey(state);
        const node = this.searchDict.get(key);
        if (node === undefined) {
            const newNode = new SearchNode(state, this.gameRule.numPlayer);
            this.searchDict.set(key, newNode);
            return newNode;
        } else {
            return node
        }
    }

    updateRoot(state: GameState) {
        this.root = this.makeSearchNode(state);
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
        const valueScore = childNode.rewardCount[0]/childNode.visitCount;
        return valueScore + confidence;
    }

    getNextNode(parentNode: SearchNode<GameState>): SearchNode<GameState> {
        const ucbList = parentNode.children.map((childNode) => this.getChildUcbScore(parentNode, childNode));
        const maxIdx = ucbList.reduce((maxIdx, curVal, idx, arr) => (arr[maxIdx] < curVal? idx : maxIdx), 0);
        return parentNode.children[maxIdx];
    }

    // Return final state and its depth
    randomPlayRec(state: GameState, depth: number): [GameState, number] {
        const childState = this.gameRule.getRandomChild(state);
        if (childState === undefined) {
            return [state, depth];
        } else {
            return this.randomPlayRec(childState, depth+1);
        }
    }

    randomPlay(state: GameState): [GameState, number] {
        return this.randomPlayRec(state, 0);
    }

    // Return final game state(end) and its depth from caller.
    monteCarloSearchRec(curNode: SearchNode<GameState>): [GameState, number] {
        if (curNode.isLeaf()) {
            if (this.gameRule.isEnd(curNode.gameState)) {
                const reward = this.gameRule.getReward(curNode.gameState);
                curNode.addReward(reward);
                console.log(`Selection (${curNode.gameState}): Reached end. Get ${reward}.`)
                return [curNode.gameState, 1];
            } else {
                this.appendChildren(curNode);
                console.log(`Expansion (${curNode.gameState})`)
                const [finalState, depth] = this.randomPlay(curNode.gameState);
                const reward = this.gameRule.getPrevReward(finalState, depth);
                curNode.addReward(reward);
                console.log(`Rollout (${curNode.gameState}): End at ${finalState}. Get ${reward}`)
                return [finalState, depth+1];
            }
        } else {
            const nextNode = this.getNextNode(curNode);
            console.log(`Selection (${curNode.gameState}): Search ${nextNode.gameState}`)
            const [finalState, depth] = this.monteCarloSearchRec(nextNode);
            const reward = this.gameRule.getPrevReward(finalState, depth);
            curNode.addReward(reward);
            console.log(`Backprop to (${curNode.gameState}): From ${finalState} of depth ${depth}. Get ${reward}`)
            return [finalState, depth+1];
        }
    }

    monteCarloSearch(maxIter: number): GameState {
        if (this.gameRule.isEnd(this.root.gameState)) {
            // Trivial case. (root is gameover)
            return this.root.gameState
        }
        for (var iter=0; iter < maxIter; iter++) {
            console.log(`iteration ${iter+1} ---------`)
            this.monteCarloSearchRec(this.root);
        }
        const rewardRate = this.root.children.map((item) => item.rewardRate[0])
        const maxIdx = findMaxIdx(rewardRate);
        return this.root.children[maxIdx].gameState;
    }
}

