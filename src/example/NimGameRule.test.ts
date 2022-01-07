import { nimGameRule } from "./NimGameRule";
import { MonteCarloSearchGraph } from "../MonteCarloSearchGraph";

const sg = new MonteCarloSearchGraph(28, nimGameRule);

const pick = sg.monteCarloSearch(1000);
console.log(pick);

console.log(sg.root.children.map((item) => item.rewardRate))
console.log(sg.root.children.map((item) => sg.getChildUcbScore(sg.root, item)))
