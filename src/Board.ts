import { GameRule } from "./GameRule";
import { Player } from "./Player";

export class Board<GameState> {
    players: Player<GameState>[] = [];
    numPlayer: number;
    gameRule: GameRule<GameState>
    gameState: GameState
    constructor(numPlayer: number, amityList: number[][][], gameRule: GameRule<GameState>) {
        this.numPlayer = numPlayer;
        for (var i=0; i<numPlayer; i++) {
            const player = new Player<GameState>(i, amityList[i])
            this.players.push(player)
        }
        this.gameRule = gameRule;
        this.gameState = gameRule.initialState;
    }

    playOneTurn() {
        if (this.gameRule.isEnd(this.gameState)) {
            console.log(`end of game`)
            return null;
        }
        const playerNum = this.gameRule.getPlayer(this.gameState);
        const nextState = this.players[playerNum].searchAction(this.gameState, this.gameRule, 1000);
        console.log(`${this.gameRule.getKey(nextState)}`)
        this.gameState = nextState;
        return nextState;
    }

    reset() {
        this.gameState = this.gameRule.initialState;
    }

    playTillEnd(iter: number) {
        while(!this.gameRule.isEnd(this.gameState)){
            const playerNum = this.gameRule.getPlayer(this.gameState);
            const nextState = this.players[playerNum].searchAction(this.gameState, this.gameRule, iter);
            console.log(`${this.gameRule.getKey(nextState)}`)
            this.gameState = nextState;
        }
        return (this.gameRule.getPlayer(this.gameState)-1+this.numPlayer)%this.numPlayer
    }
}