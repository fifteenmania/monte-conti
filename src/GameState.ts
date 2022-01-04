interface GameSetting {
    maxCall: number;
    numEnd: number;
    numPeople: number;
    minCall: number;
}

const defaultGameSetting: GameSetting = {
    maxCall: 3,
    numEnd: 31,
    numPeople: 3,
    minCall: 1
}

class GameState {
    static gameSetting: GameSetting = defaultGameSetting;
    state: number;
    constructor(state: number) {
        this.state = state;
    }

    * generateChildState() {
        for (var newState = this.state + GameState.gameSetting.minCall; 
                newState <= this.state + GameState.gameSetting.maxCall
                && GameState.stateIsValid(newState);
                newState ++){
            yield newState
        }
    }

    // allow replacement to support continuous selection space
    * generateChildStateRandom() {
        if (this.isEnd()) {
            return;
        }
        while (true) {
            const pickMax = Math.min(this.state + GameState.gameSetting.maxCall,
                    GameState.gameSetting.numEnd);
            const pickMin = Math.min(this.state + GameState.gameSetting.minCall,
                    GameState.gameSetting.numEnd);
            const pickState = pickMin + Math.floor((pickMax - pickMin + 1)*Math.random())
            yield pickState;
        }
    }

    static stateIsEnd(state: number): boolean {
        return state === GameState.gameSetting.numEnd;
    }

    isEnd(): boolean {
        return GameState.stateIsEnd(this.state);
    }
    
    static stateIsValid(state: number): boolean {
        return state <= GameState.gameSetting.numEnd;
    }

    isValid(): boolean {
        return GameState.stateIsValid(this.state);
    }

    // randomly play and return player who picked last
    randomPlay(player: number): number {
        const childGenerator = this.generateChildStateRandom().next();
        if (childGenerator.done) {
            return player
        } else {
            return new GameState(childGenerator.value).randomPlay((player+1)%GameState.gameSetting.numPeople)
        }
    }

    rollout() {
        const myturn = 0;
        const maxIteration = 30;
        const winCount = new Array<number>(GameState.gameSetting.numPeople).fill(0);
        for (var iterCount=0; iterCount<maxIteration; iterCount++) {
            const winPlayer = this.randomPlay(myturn);
            winCount[winPlayer] += 1;
        }
        return winCount.map((item) => item/maxIteration);
    }
}

class SearchNode {
    gameState: GameState;
    winRate: number[];
    visitCount: number;
    children: SearchNode[];
    prior: number = 0;
    epsilon: number = 1/
            (GameState.gameSetting.maxCall-GameState.gameSetting.minCall+1)
            /100;
    constructor (gameState: GameState) {
        this.gameState = gameState;
        this.winRate = gameState.rollout();
        this.visitCount = 1;
        this.children = [];
    }

    // epsilon greedy policy
    getPrior(): number[] {
        const winVec = this.children.map((node) => node.winRate[1]);
        const maxVal = Math.max(...winVec);
        var maxCount = 0;
        const maxArray: boolean[] = [];
        for (var idx=0; idx<winVec.length; idx++) {
            if (Math.abs(winVec[idx] - maxVal) < 1e-4 ) {
                maxCount += 1;
                maxArray.push(true)
            } else {
                maxArray.push(false)
            }
        }
        return maxArray.map((item) => item? 
            (1-this.epsilon)/(maxCount) :
            this.epsilon/(maxArray.length - maxCount)
        )
    }

    isLeaf() {
        return this.gameState.isEnd();
    }

    appendChildren(makeSearchNode: (state: number) => SearchNode) {
        const childGenerator = this.gameState.generateChildState();
        for (const childState of childGenerator) {
            this.visitCount += 1;
            this.children.push(makeSearchNode(childState));
        }
        const priors = this.getPrior();
        this.populatePriors(priors);
    }

    populatePriors(priors: number[]) {
        for (var i =0; i<this.children.length; i++) {
            this.children[i].prior = priors[i];
        }
    }

    getGainSingle(player: number): number {
        return this.winRate[player];
    }

    getChildUcbScore(childNode: SearchNode) {
        const priorScore = childNode.prior * Math.sqrt(this.visitCount/childNode.visitCount)
        const valueScore = childNode.winRate[GameState.gameSetting.numPeople-1]
        return valueScore + priorScore;
    }

    getNextNode() {
        return this.children.reduce((maxNode: SearchNode, curNode: SearchNode) => {
            const maxUcb = this.getChildUcbScore(maxNode);
            const curUcb = this.getChildUcbScore(curNode);
            return maxUcb < curUcb ? curNode : maxNode
        }, this.children[0]);
    }
}

function randomSample(arr: number[]):number {
    const pickIdx = Math.floor(Math.random() * arr.length);
    return arr[pickIdx];
}

class SearchGraph {
    root: SearchNode;
    searchDict: Map<number, SearchNode>;
    constructor(initaialState: number) {
        this.root = new SearchNode(new GameState(initaialState));
        this.searchDict = new Map<number, SearchNode>();
        this.searchDict.set(initaialState, this.root);
    }

    makeSearchNode(state: number): SearchNode {
        if (this.searchDict.has(state)) {
            return this.searchDict.get(state) ?? this.root;
        } else {
            return new SearchNode(new GameState(state));
        }
    }

    monteCarloSearch() {
        var curNode = this.root;
        curNode.appendChildren(this.makeSearchNode.bind(this));
        const node = curNode.getNextNode();
        console.log(node);
    }
}

const sg = new SearchGraph(0);
sg.monteCarloSearch();