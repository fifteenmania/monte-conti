
export class People {
    amity: number[];
    order: number
    constructor(order: number) {
        this.order = order;
        this.amity = new Array(3).fill(0);
        this.amity[order] = 1;
    }

    getPersonalReward(reward: number[], amity: number[]) {
        return reward.reduce((sum, val, idx) => sum + val*amity[idx], 0);
    }
}