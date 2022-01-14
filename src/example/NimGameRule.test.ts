import { NimGameRule, NimGameState } from "./NimGameRule";
import { MonteCarloSearchGraph } from "../MonteCarloSearchGraph";
import {FavoredGraph} from "../FavoredGraph"
import { matToString, nomalizeRows } from "../utils";

const nimGameRule = new NimGameRule(3, 3, 31);
const results = []
for (var corr = 0; corr < 1; corr += 0.1) {
    const amityMatrix: number[][] = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ]
    const initial = nimGameRule.initialState;
    const sg = new FavoredGraph(initial, nimGameRule, nomalizeRows(amityMatrix));
    const pick = sg.monteCarloSearch(30000);
    console.log(pick);
    console.log(sg.root.children.map((item) => item.rewardRate))
    console.log(sg.root.rewardRate)
    results.push(sg.root.rewardRate)
}
console.log(matToString(results));

