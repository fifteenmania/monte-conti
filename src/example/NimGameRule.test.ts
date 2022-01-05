import { nimGameRule } from "./NimGameRule";
import { MonteCarloSearchGraph } from "../SearchNode";

const sg = new MonteCarloSearchGraph(0, nimGameRule);

const winRates = sg.monteCarloSearch(10);
console.log(winRates);

console.log(sg.root.children.map((item) => sg.getChildUcbScore(sg.root, item)))
console.log(sg.root.children.map((item) => item.winRate))