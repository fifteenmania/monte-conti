import { GameRule } from "../SearchNode";

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

    function nextPlayer(player: number) {
        return (player + 1)%(gameSetting.numPeople);
    }

    function prevPlayer(player: number) {
        return (player - 1 + gameSetting.numPeople)%gameSetting.numPeople;
    }

    function isEnd(state: number): boolean {
        return state === gameSetting.numEnd;
    }
    
    function isValid(state: number): boolean {
        return state <= gameSetting.numEnd;
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
        nextPlayer,
        prevPlayer,
        isEnd,
        getChildren,
        getRandomChild
    }
})();


