import { GameRule } from "../GameRule";


export class NimGameRule implements GameRule<number> {
    maxCall: number;
    numPlayer: number;
    numEnd: number;
    minCall: number;
    constructor(numPlayer: number, maxCall: number, numEnd: number, minCall: number = 1) {
        this.maxCall = maxCall;
        this.numPlayer = numPlayer;
        this.numEnd = numEnd;
        this.minCall = minCall;
    }

    get initialState() {
        return 0;
    }

    getKey(state: number) {
        return state.toString();
    }

    nextPlayer(state: number, player: number) {
        return (player + 1)%(this.numPlayer);
    }

    prevPlayer(state: number, player: number) {
        return (player - 1 + this.numPlayer)%this.numPlayer;
    }

    isEnd(state: number): boolean {
        return state === this.numEnd;
    }
    
    isValid(state: number): boolean {
        return state <= this.numEnd;
    }

    getReward(state: number): number[] {
        const reward = new Array(this.numPlayer).fill(0);
        if (state === this.numEnd) {
            reward[0] = 1;
            return reward;
        } else {
            return reward;
        }
    }

    getPrevReward(state: number, turns: number): number[] {
        const reward = new Array(this.numPlayer).fill(0);
        if (state === this.numEnd) {
            reward[(turns)%this.numPlayer] = 1;
        } 
        return reward;
    }

    // return all children states
    getChildren(state: number): number[] {
        const result: number[] = [];
        if (this.isEnd(state)) {
            return result;
        }
        for (var newState = state + this.minCall;
                newState <= state + this.maxCall && newState <= this.numEnd;
                newState++) {
            result.push(newState);
        }
        return result;
    }

    // return one random child state
    getRandomChild(state: number): number|undefined {
        if (this.isEnd(state)) {
            return;
        }
        const pickMax = Math.min(state + this.maxCall,
                this.numEnd);
        const pickMin = Math.min(state + this.minCall,
                this.numEnd);
        const pickState = pickMin + Math.floor((pickMax - pickMin + 1)*Math.random())
        return pickState;
    }
}


