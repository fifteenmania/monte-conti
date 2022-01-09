import { GameRule } from "../GameRule";

interface NimBetState {
    // remaining bet amont
    remainingBet: number;
    // total bet amonunt 
    betSum: number;
    betBase: number;
    removedCoin: number;
}

function randomSample<T>(arr: T[]): T {
    //TODO
    return arr[0];
}

export class NimBetRule implements GameRule<NimBetState> {
    numPlayer: number;
    maxCall: number;
    initialBase: number;
    minCall: number;
    constructor(numPlayer: number, maxCall: number, initialBase: number, minCall: number = 1) {
        this.numPlayer = numPlayer;
        this.maxCall = maxCall;
        this.initialBase = initialBase;
        this.minCall = minCall;
    }

    get maxReward(): number {
        return 10;
    }

    get initialState(): NimBetState {
        return {
            remainingBet: this.numPlayer,
            betSum: 0,
            betBase: this.initialBase,
            removedCoin: 0
        }
    }

    getKey(state: NimBetState):string {
        return JSON.stringify(state)
    }

    isEnd(state: NimBetState) {
        return state.remainingBet === 0 && (state.betSum === state.removedCoin)
    }

    getReward(state: NimBetState) {
        const rewardArray = new Array(this.numPlayer).fill(0);
        if (this.isEnd(state)) {
            rewardArray[0] = state.betSum/this.maxReward;
        }
        return rewardArray;
    }

    getPrevReward(state: NimBetState, turns: number){
        const rewardArray = new Array(this.numPlayer).fill(0);
        if (this.isEnd(state)) {
            rewardArray[(turns)%this.numPlayer] = state.betSum/this.maxReward;
        }
        return rewardArray;
    }

    getChildren(state: NimBetState) {
        if (state.remainingBet === 0) {
            // main game
            if (state.removedCoin === state.betSum) {
                return []
            }
            const result = [];
            for (var i=0; i<state.betSum; i++) {
                const nextState: NimBetState = {...state};
                nextState.removedCoin += i;
                result.push(nextState)
            }
            return result;
        } else {
            // betting phase
            const callState: NimBetState = {
                remainingBet: state.remainingBet - 1,
                betSum: state.betSum + state.betBase,
                betBase: state.betBase,
                removedCoin: state.removedCoin
            }
            const dieState: NimBetState = {
                remainingBet: state.remainingBet - 1,
                betSum: state.betSum + 1,
                betBase: state.betBase,
                removedCoin: state.removedCoin
            }
            const raceState: NimBetState = {
                remainingBet: state.remainingBet - 1,
                betSum: state.betSum + state.betBase * 2,
                betBase: state.betBase * 2,
                removedCoin: state.removedCoin
            }
            return [callState, dieState, raceState];
        }
    }

    getRandomChild(state: NimBetState) {
        const children = this.getChildren(state);
        if (children?.length === 1) {
            return undefined
        } else {
            return randomSample<NimBetState>(children)
        }
    }
}

