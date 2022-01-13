import { NimGameRule, NimGameState } from "./NimGameRule";
import { MonteCarloSearchGraph } from "../MonteCarloSearchGraph";
import {FavoredGraph} from "../FavoredGraph"

const nimGameRule = new NimGameRule(3, 3, 31);
const initial = nimGameRule.initialState;
const testState: NimGameState = {
    counted: 0,
    player: 0
}

const sg = new FavoredGraph(testState, nimGameRule);

const pick = sg.monteCarloSearch(1000);
console.log(pick);

console.log(sg.root.children.map((item) => item.rewardRate))
console.log(sg.root.rewardRate)