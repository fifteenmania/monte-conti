export function findMaxIdx(arr: number[]) {
    const maxValue = arr.reduce((maxVal, curVal) => maxVal < curVal? curVal: maxVal, 0);
    return arr.findIndex((value) => value === maxValue);
}

export function vecVecDot(arr1:number[], arr2: number[]):number {
    var result = 0;
    for (var i=0; i<arr1.length; i++) {
       result += arr1[i] * arr2[i]; 
    }
    return result;
}