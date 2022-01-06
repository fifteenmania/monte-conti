import { nimGameRule } from "./NimGameRule";
import { MonteCarloSearchGraph } from "../MonteCarloSearchGraph";

const sg = new MonteCarloSearchGraph(28, nimGameRule);

const winRates = sg.monteCarloSearch(100);
console.log(winRates);

console.log(sg.root.children.map((item) => sg.getChildUcbScore(sg.root, item)))
console.log(sg.root.children.map((item) => item.winRate))
