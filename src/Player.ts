import { NimGameRule, NimGameState } from "./example/NimGameRule";
import { FavoredGraph } from "./FavoredGraph";
import { GameRule } from "./GameRule";
import { normalizeRows, normalize } from "./utils";

export class Player<GameState> {
    order: number;
    amity: number[][];
    constructor(order: number, amity: number[][]) {
        this.order = order;
        this.amity = normalizeRows(amity);
    }

    searchAction(prevState: GameState, gameRule: GameRule<GameState>, iter: number): GameState {
        const sg = new FavoredGraph(prevState, gameRule, this.amity);
        return sg.monteCarloSearch(iter);
    }
}
