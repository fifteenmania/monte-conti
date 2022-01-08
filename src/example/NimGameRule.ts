import { GameRule } from "../GameRule";

export interface NimGameSetting {
    maxCall: number;
    numEnd: number;
    numPeople: number;
    minCall: number;
}

const defaultGameSetting: NimGameSetting = {
    maxCall: 3,
    numEnd: 31,
    numPeople: 3,
    minCall: 1
}

export class NimGameRule implements GameRule<number> {    
    gameSetting: NimGameSetting;
    constructor(gameSetting = defaultGameSetting) {
        this.gameSetting = gameSetting;
    }

    get numPlayer() {
        return this.gameSetting.numPeople;
    }

    getKey(state: number) {
        return state.toString();
    }

    nextPlayer(state: number, player: number) {
        return (player + 1)%(this.gameSetting.numPeople);
    }

    prevPlayer(state: number, player: number) {
        return (player - 1 + this.gameSetting.numPeople)%this.gameSetting.numPeople;
    }

    isEnd(state: number): boolean {
        return state === this.gameSetting.numEnd;
    }
    
    isValid(state: number): boolean {
        return state <= this.gameSetting.numEnd;
    }

    getReward(state: number): number[] {
        const reward = new Array(this.gameSetting.numPeople).fill(0);
        if (state === this.gameSetting.numEnd) {
            reward[0] = 1;
            return reward;
        } else {
            return reward;
        }
    }

    getPrevReward(state: number, turns: number): number[] {
        const reward = new Array(this.gameSetting.numPeople).fill(0);
        if (state === this.gameSetting.numEnd) {
            reward[(turns)%this.gameSetting.numPeople] = 1;
            return reward;
        } else {
            return reward;
        }
    }

    // return all children states
    getChildren(state: number): number[] {
        const result: number[] = [];
        if (this.isEnd(state)) {
            return result;
        }
        for (var newState = state + this.gameSetting.minCall;
                newState <= state + this.gameSetting.maxCall && newState <= this.gameSetting.numEnd;
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
        const pickMax = Math.min(state + this.gameSetting.maxCall,
                this.gameSetting.numEnd);
        const pickMin = Math.min(state + this.gameSetting.minCall,
                this.gameSetting.numEnd);
        const pickState = pickMin + Math.floor((pickMax - pickMin + 1)*Math.random())
        return pickState;
    }
}


