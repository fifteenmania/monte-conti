import { NimGameRule, NimGameState } from "./NimGameRule";
import { MonteCarloSearchGraph } from "../MonteCarloSearchGraph";

const nimGameRule = new NimGameRule(3, 3, 31);
const initial = nimGameRule.initialState;
const testState: NimGameState = {
    counted: 28,
    player: 2
}

const sg = new MonteCarloSearchGraph(initial, nimGameRule);

const pick = sg.monteCarloSearch(10);
console.log(pick);

console.log(sg.root.children.map((item) => item.rewardCount))