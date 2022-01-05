"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NimGameRule_1 = require("./example/NimGameRule");
const SearchNode_1 = require("./SearchNode");
const sg = new SearchNode_1.MonteCarloSearchGraph(28, NimGameRule_1.nimGameRule);
sg.monteCarloSearch(1);
