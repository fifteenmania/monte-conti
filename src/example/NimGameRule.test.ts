import { NimGameRule } from "./NimGameRule";
import { MonteCarloSearchGraph } from "../MonteCarloSearchGraph";

const nimGameRule = new NimGameRule();
const sg = new MonteCarloSearchGraph(0, nimGameRule);

const pick = sg.monteCarloSearch(1000);
console.log(pick);

console.log(sg.root.children.map((item) => item.rewardRate))
console.log(sg.root.children.map((item) => sg.getChildUcbScore(sg.root, item)))
