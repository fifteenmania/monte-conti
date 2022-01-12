import {NimBetRule} from './NimBetRule';
import {MonteCarloSearchGraph} from '../MonteCarloSearchGraph';

const nimbetRule = new NimBetRule(3, 3, 4, 1);
const initial = nimbetRule.initialState

const sg = new MonteCarloSearchGraph(initial, nimbetRule);
//const pick = sg.monteCarloSearch(5);


