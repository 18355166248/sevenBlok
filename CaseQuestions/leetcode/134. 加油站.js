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

// 总结：如果x到不了y+1（但能到y），那么从x到y的任一点出发都不可能到达y+1。因为从其中任一点出发的话，相当于从0开始加油，而如果从x出发到该点则不一定是从0开始加油，可能还有剩余的油。既然不从0开始都到不了y+1，那么从0开始就更不可能到达y+1了...
