import { nimGameRule } from "./NimGameRule";
import { MonteCarloSearchGraph } from "../SearchNode";

const sg = new MonteCarloSearchGraph(28, nimGameRule);

const winRates = sg.monteCarloSearch(200);
console.log(winRates);
