var canCompleteCircuit = function(gas, cost) {
  const n = gas.length;
  let i = 0;
  while (i < n) {
    let sumGas = 0,
      sumCost = 0,
      ant = 0;
    while (ant < n) {
      const j = (ant + i) % n;
      sumGas += gas[j];
      sumCost += cost[j];
      if (sumGas < sumCost) break;
      ant++;
    }
    if (ant === n) {
      return i;
    } else {
      i = i + ant + 1;
    }
  }

  return -1;
};
console.log(canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]));
// console.log(canCompleteCircuit([2, 3, 4], [3, 4, 3]));
