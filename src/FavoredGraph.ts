import {SearchNode} from './SearchNode'
import {GameRule} from './GameRule'
import { findMaxIdx, vecVecDot } from './utils';

export class FavoredGraph<GameState> {
    root: SearchNode<GameState>;
    gameRule: GameRule<GameState>;
    searchDict: Map<string, SearchNode<GameState>>;
    amityMatrix: number[][] = [
        [1, 0, 0.8],
        [0, 1, 0],
        [0.2, 0, 1]
    ]
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
        const parentPlayer = this.gameRule.getPlayer(parentNode.gameState);
        const amity = this.amityMatrix[parentPlayer]
        const confidence = Math.sqrt(2*Math.log2(parentNode.visitCount)/childNode.visitCount)
        const valueScore = vecVecDot(childNode.rewardCount, amity)/childNode.visitCount;
        return valueScore + confidence;
    }

    getNextNode(parentNode: SearchNode<GameState>): SearchNode<GameState> {
        const ucbList = parentNode.children.map((childNode) => this.getChildUcbScore(parentNode, childNode));
        const maxIdx = ucbList.reduce((maxIdx, curVal, idx, arr) => (arr[maxIdx] < curVal? idx : maxIdx), 0);
        return parentNode.children[maxIdx];
    }

    // Return final state and its depth
    randomPlayRec(state: GameState, depth: number): number[] {
        const childState = this.gameRule.getRandomChild(state);
        if (childState === undefined) {
            return this.gameRule.getReward(state);
        } else {
            return this.randomPlayRec(childState, depth+1);
        }
    }

    randomPlay(state: GameState): number[] {
        return this.randomPlayRec(state, 0);
    }

    // Return final game state(end) and its depth from caller.
    monteCarloSearchRec(curNode: SearchNode<GameState>): number[] {
        const key = this.gameRule.getKey(curNode.gameState)
        if (curNode.isLeaf()) {
            if (this.gameRule.isEnd(curNode.gameState)) {
                const reward = this.gameRule.getReward(curNode.gameState);
                curNode.addReward(reward);
                console.log(`Selection (${key}): Reached end. Get ${reward}.`)
                return reward;
            } else {
                this.appendChildren(curNode);
                console.log(`Expansion (${this.gameRule.getKey(curNode.gameState)})`)
                const reward = this.randomPlay(curNode.gameState);
                curNode.addReward(reward);
                console.log(`Rollout (${key}): Get ${reward}`)
                return reward;
            }
        } else {
            const nextNode = this.getNextNode(curNode);
            console.log(`Selection (${key}): Search ${this.gameRule.getKey(nextNode.gameState)}`)
            const reward = this.monteCarloSearchRec(nextNode);
            curNode.addReward(reward);
            console.log(`Backprop to (${key}): Get ${reward}`)
            return reward
        }
    }

    monteCarloSearch(maxIter: number): GameState {
        console.log(`Starting From Root ${this.gameRule.getKey(this.root.gameState)}`)
        if (this.gameRule.isEnd(this.root.gameState)) {
            // Trivial case. (root is gameover)
            return this.root.gameState
        }
        for (var iter=0; iter < maxIter; iter++) {
            console.log(`iteration ${iter+1} ---------`)
            this.monteCarloSearchRec(this.root);
        }
        const player = this.gameRule.getPlayer(this.root.gameState)
        const amity = this.amityMatrix[player];
        const rewardRate = this.root.children.map((item) => vecVecDot(item.rewardCount, amity))
        const maxIdx = findMaxIdx(rewardRate);
        return this.root.children[maxIdx].gameState;
    }
}

