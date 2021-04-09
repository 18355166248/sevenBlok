/**
 * @param {number[]} answers
 * @return {number}
 */
var numRabbits = function (answers) {
  const map = new Map()

  for (const y of answers) {
    map.set(y, (map.get(y) || 0) + 1)
  }

  let total = 0
  for (const [y, x] of map.entries()) {
    total += Math.ceil(x / (y + 1)) * (y + 1)
  }

  return total
};

const a = [1, 1, 2]
const b = [10, 10, 10]

console.log(numRabbits(a));
console.log(numRabbits(b));
