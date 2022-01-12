import { GameRule } from "../GameRule";

interface NimBetState {
    // remaining bet amont
    remainingBet: number;
    // total bet amonunt 
    betSum: number;
    betBase: number;
    removedCoin: number;
    isDie: boolean[];
    player: number;
}

function randomSample<T>(arr: T[]): T {
    const pickIdx = Math.floor(Math.random()*arr.length)
    return arr[pickIdx];
}

function numTrue(arr: boolean[]): number {
    return arr.reduce((trueNum, cur) => cur? trueNum+1:trueNum, 0);
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
        return this.initialBase*(Math.pow(2, this.numPlayer)-1);
    }

    get initialState(): NimBetState {
        return {
            remainingBet: this.numPlayer,
            betSum: 0,
            betBase: this.initialBase,
            removedCoin: 0,
            player: this.numPlayer-1,
            isDie: new Array<boolean>(this.numPlayer).fill(false)
        }
    }

    getKey(state: NimBetState):string {
        if (state.remainingBet === 0) {
            return `m-${state.isDie}/${state.player}:${state.removedCoin}`
        } else {
            return `b-${state.remainingBet}/${state.isDie}/${state.player}:${state.betSum}/${state.betBase}`
        }
    }

    isEnd(state: NimBetState) {
        return (numTrue(state.isDie) >= this.numPlayer-1) || 
            (state.remainingBet === 0 && (state.betSum === state.removedCoin));
    }

    getPlayer(state: NimBetState): number {
        return state.player;
    }

    nextPlayer(state: NimBetState): number| undefined {
        if (this.isEnd(state)) {
            console.log("game end")
            return undefined;
        }
        var candidate = (state.player+1)%this.numPlayer;
        while (state.isDie[candidate]) {
            (candidate+1)%this.numPlayer;
        }
        return candidate
    }
    
    getReward(state: NimBetState) {
        const rewardArray = new Array(this.numPlayer).fill(0);
        if (this.isEnd(state)) {
            rewardArray[state.player] = state.betSum/this.maxReward;
        }
        return rewardArray;
    }

    getChildren(state: NimBetState) {
        if (state.remainingBet === 0) {
            // main game
            const result = [];
            const nextPlayer = this.nextPlayer(state);
            if (nextPlayer === undefined) {
                return [];
            }
            for (var i = state.removedCoin; i < state.removedCoin + this.maxCall && i <= state.betSum; i++) {
                const nextState: NimBetState = {...state};
                nextState.removedCoin = i;
                nextState.player = nextPlayer;
                result.push(nextState)
            }
            return result;
        } else {
            const nextPlayer = this.nextPlayer(state);
            if (nextPlayer === undefined) {
                return [];
            }
            // betting phase
            const callState: NimBetState = {
                remainingBet: state.remainingBet - 1,
                betSum: state.betSum + state.betBase,
                betBase: state.betBase,
                removedCoin: state.removedCoin,
                isDie: state.isDie,
                player: nextPlayer
            }
            const dieList = [...state.isDie];
            dieList[state.player] = true;
            const dieState: NimBetState = {
                remainingBet: state.remainingBet - 1,
                betSum: state.betSum + 1,
                betBase: state.betBase,
                removedCoin: state.removedCoin,
                isDie: dieList,
                player: nextPlayer
            }
            const raceState: NimBetState = {
                remainingBet: state.remainingBet - 1,
                betSum: state.betSum + state.betBase * 2,
                betBase: state.betBase * 2,
                removedCoin: state.removedCoin,
                isDie: state.isDie,
                player: nextPlayer
            }
            return [callState, dieState, raceState];
        }
    }

    getRandomChild(state: NimBetState) {
        if (this.isEnd(state)) {
            return undefined;
        }
        const children = this.getChildren(state);
        return randomSample<NimBetState>(children);
    }
}

