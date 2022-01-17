import {Board} from './Board';
import { NimGameRule, NimGameState } from './example/NimGameRule';
import { normalize } from './utils';

const amityList: number[][][] = [[
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
],
[
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
],
[
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
]
]
const gameRule = new NimGameRule(3, 3, 31, 1)
const board = new Board<NimGameState>(3, amityList, gameRule);

const result = new Array(3).fill(0)
for (var i=0; i<50; i++) {
    const winner = board.playTillEnd(30000)
    result[winner] += 1;
    board.reset();
}

console.log(normalize(result));