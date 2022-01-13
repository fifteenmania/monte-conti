import { GameRule } from "../GameRule";


export interface NimGameState {
    counted: number;
    player: number;
}

export class NimGameRule implements GameRule<NimGameState> {
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
        return {
            counted: 0,
            player: 0
        };
    }

    getKey(state: NimGameState): string {
        return `${state.player.toString()}:${state.counted.toString()}`;
    }

    isEnd(state: NimGameState): boolean {
        return state.counted === this.numEnd;
    }

    getPlayer(state: NimGameState):number {
        return state.player;
    };

    getPrevPlayer(state: NimGameState): number{
        return (state.player-1+this.numPlayer)%this.numPlayer;
    };

    getNextPlayer(state: NimGameState): number{
        return (state.player+1)%this.numPlayer;
    };

    getReward(state: NimGameState): number[] {
        const reward = new Array(this.numPlayer).fill(0);
        if (state.counted === this.numEnd) {
            reward[this.getPrevPlayer(state)] = 1;
            return reward;
        } else {
            return reward;
        }
    }

    // return all children states
    getChildren(state: NimGameState): NimGameState[] {
        const result: NimGameState[] = [];
        if (this.isEnd(state)) {
            return result;
        }
        for (var newCounted = state.counted + this.minCall;
                newCounted <= state.counted + this.maxCall && newCounted <= this.numEnd;
                newCounted++) {
            const newState: NimGameState = {
                counted: newCounted,
                player: (state.player + 1)%this.numPlayer
            }
            result.push(newState);
        }
        return result;
    }

    // return one random child state
    getRandomChild(state: NimGameState): NimGameState|undefined {
        if (this.isEnd(state)) {
            return;
        }
        const pickMax = Math.min(state.counted + this.maxCall,
                this.numEnd);
        const pickMin = Math.min(state.counted + this.minCall,
                this.numEnd);
        const pickState: NimGameState = {
            counted: pickMin + Math.floor((pickMax - pickMin + 1)*Math.random()),
            player: (state.player + 1)%this.numPlayer
        }
        return pickState;
    }
}


