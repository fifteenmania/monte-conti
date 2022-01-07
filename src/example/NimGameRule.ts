import { GameRule } from "../GameRule";

export interface NimGameSetting {
    maxCall: number;
    numEnd: number;
    numPeople: number;
    minCall: number;
}

export const nimGameRule: GameRule<number> = (function () {
    const defaultGameSetting: NimGameSetting = {
        maxCall: 3,
        numEnd: 31,
        numPeople: 3,
        minCall: 1
    }

    const gameSetting = defaultGameSetting;

    function getKey(state: number) {
        return state.toString();
    }

    function nextPlayer(state: number, player: number) {
        return (player + 1)%(gameSetting.numPeople);
    }

    function prevPlayer(state: number, player: number) {
        return (player - 1 + gameSetting.numPeople)%gameSetting.numPeople;
    }

    function isEnd(state: number): boolean {
        return state === gameSetting.numEnd;
    }
    
    function isValid(state: number): boolean {
        return state <= gameSetting.numEnd;
    }

    function getReward(state: number): number[] {
        const reward = new Array(gameSetting.numPeople).fill(0);
        if (state === gameSetting.numEnd) {
            reward[0] = 1;
            return reward;
        } else {
            return reward;
        }
    }

    function getPrevReward(state: number, turns: number): number[] {
        const reward = new Array(gameSetting.numPeople).fill(0);
        if (state === gameSetting.numEnd) {
            reward[(turns)%gameSetting.numPeople] = 1;
            return reward;
        } else {
            return reward;
        }
    }

    // return all children states
    function getChildren(state: number): number[] {
        const result: number[] = [];
        if (isEnd(state)) {
            return result;
        }
        for (var newState = state + gameSetting.minCall;
                newState <= state + gameSetting.maxCall && newState <= gameSetting.numEnd;
                newState++) {
            result.push(newState);
        }
        return result;
    }

    // return one random child state
    function getRandomChild(state: number): number|undefined {
        if (isEnd(state)) {
            return;
        }
        const pickMax = Math.min(state + gameSetting.maxCall,
                gameSetting.numEnd);
        const pickMin = Math.min(state + gameSetting.minCall,
                gameSetting.numEnd);
        const pickState = pickMin + Math.floor((pickMax - pickMin + 1)*Math.random())
        return pickState;
    }

    return {
        numPlayer: gameSetting.numPeople,
        getKey,
        nextPlayer,
        prevPlayer,
        isEnd,
        getReward,
        getPrevReward,
        getChildren,
        getRandomChild
    }
})();


