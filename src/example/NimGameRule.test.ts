import { nimGameRule } from "./NimGameRule";
import { MonteCarloSearchGraph } from "../SearchNode";

const sg = new MonteCarloSearchGraph(28, nimGameRule);
console.log(sg)

const winRates = sg.monteCarloSearch(6);
console.log(winRates);