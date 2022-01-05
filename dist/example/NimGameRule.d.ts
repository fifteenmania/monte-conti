import { GameRule } from "../SearchNode";
export interface NimGameSetting {
    maxCall: number;
    numEnd: number;
    numPeople: number;
    minCall: number;
}
export declare const nimGameRule: GameRule<number>;
