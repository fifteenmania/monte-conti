"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nimGameRule = void 0;
exports.nimGameRule = (function () {
    const defaultGameSetting = {
        maxCall: 3,
        numEnd: 31,
        numPeople: 3,
        minCall: 1
    };
    const gameSetting = defaultGameSetting;
    function nextPlayer(player) {
        return (player + 1) % (gameSetting.numPeople);
    }
    function prevPlayer(player) {
        return (player - 1 + gameSetting.numPeople) % gameSetting.numPeople;
    }
    function isEnd(state) {
        return state === gameSetting.numEnd;
    }
    function isValid(state) {
        return state <= gameSetting.numEnd;
    }
    // return all children states
    function getChildren(state) {
        const result = [];
        if (isEnd(state)) {
            return result;
        }
        for (var newState = state + gameSetting.minCall; newState <= state + gameSetting.maxCall && newState < gameSetting.numEnd; newState++) {
            result.push(newState);
        }
        return result;
    }
    // return one random child state
    function getRandomChild(state) {
        if (isEnd(state)) {
            return;
        }
        const pickMax = Math.min(state + gameSetting.maxCall, gameSetting.numEnd);
        const pickMin = Math.min(state + gameSetting.minCall, gameSetting.numEnd);
        const pickState = pickMin + Math.floor((pickMax - pickMin + 1) * Math.random());
        return pickState;
    }
    return {
        numPlayer: gameSetting.numPeople,
        nextPlayer,
        prevPlayer,
        isEnd,
        getChildren,
        getRandomChild
    };
})();
