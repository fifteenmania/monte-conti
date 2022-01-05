"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonteCarloSearchGraph = exports.SearchNode = void 0;
class SearchNode {
    constructor(gameState, numPlayer) {
        this.gameState = gameState;
        this.visitCount = 0;
        this.children = [];
        this.winCount = new Array(numPlayer).fill(0);
    }
    get winRate() {
        const sum = this.winCount.reduce((accum, val) => accum + val);
        return this.winCount.map((val) => val / sum);
    }
    isLeaf() {
        return this.children.length === 0;
    }
}
exports.SearchNode = SearchNode;
class MonteCarloSearchGraph {
    constructor(initaialState, gameRule) {
        this.gameRule = gameRule;
        this.root = new SearchNode(initaialState, this.gameRule.numPlayer);
        this.searchDict = new Map();
        this.searchDict.set(initaialState, this.root);
    }
    makeSearchNode(state) {
        var _a;
        if (this.searchDict.has(state)) {
            // ?? root is due to typescript compiler bug.
            // It never become nullish but the compiler don't know.
            return (_a = this.searchDict.get(state)) !== null && _a !== void 0 ? _a : this.root;
        }
        else {
            return new SearchNode(state, this.gameRule.numPlayer);
        }
    }
    appendChildren(searchNode) {
        const children = this.gameRule.getChildren(searchNode.gameState);
        for (const childState of children) {
            const newNode = this.makeSearchNode(childState);
            searchNode.children.push(newNode);
        }
    }
    getChildUcbScore(parentNode, childNode) {
        if (childNode.visitCount === 0) {
            return Infinity;
        }
        const confidence = Math.sqrt(2 * Math.log2(parentNode.visitCount) / childNode.visitCount);
        const valueScore = childNode.winRate[this.gameRule.prevPlayer(0)];
        return valueScore + confidence;
    }
    getNextNode(parentNode) {
        const ucbList = parentNode.children.map((childNode) => this.getChildUcbScore(parentNode, childNode));
        const maxIdx = ucbList.reduce((maxIdx, curVal, idx, arr) => (arr[maxIdx] < curVal ? idx : maxIdx), 0);
        return parentNode.children[maxIdx];
    }
    // return player who win
    randomPlay(state, player) {
        const childState = this.gameRule.getRandomChild(state);
        if (childState === undefined) {
            return player;
        }
        else {
            return this.randomPlay(childState, this.gameRule.nextPlayer(player));
        }
    }
    monteCarloSearchRec(curNode) {
        if (curNode.isLeaf()) {
            const winPlayer = this.randomPlay(curNode.gameState, 0);
            console.log(`Rollout (${curNode.gameState}): player ${winPlayer} win`);
            curNode.winCount[winPlayer] += 1;
            curNode.visitCount += 1;
            return this.gameRule.prevPlayer(winPlayer);
        }
        else {
            const nextNode = this.getNextNode(curNode);
            console.log(`Expansion (${curNode.gameState}): search ${nextNode.gameState}`);
            const winPlayer = this.monteCarloSearchRec(nextNode);
            console.log(`Backprop (${curNode.gameState}): player ${winPlayer} win`);
            curNode.winCount[winPlayer] += 1;
            curNode.visitCount += 1;
            return this.gameRule.prevPlayer(winPlayer);
        }
    }
    monteCarloSearch(maxIter) {
        for (var iter = 0; maxIter < maxIter; iter++) {
            console.log(`iteration ${iter} ------`);
            this.monteCarloSearchRec(this.root);
        }
    }
}
exports.MonteCarloSearchGraph = MonteCarloSearchGraph;
