function getTargetCopy(original, cloned, target) {
  const stack = []
  const cloneStack = []
  let node = original
  let cloneNode = cloned

  while (node !== null || stack.length !== 0) {
    if (node !== null) {
      if (node === target) return cloneNode

      stack.push(node)
      node = node.left

      cloneStack.push(cloneNode)
      cloneNode = cloneNode.left
    } else {
      node = stack.pop()
      node = node.right

      cloneNode = cloneStack.pop()
      cloneNode = cloneNode.right
    }
  }

  return null
}

const original = {
  value: 1,
  left: {
    value: 5,
    left: null,
    right: null
  },
  right: {
    value: 2,
    left: null,
    right: {
      value: 3,
      left: null,
      right: null,
    }
  }
}
// const cloned = JSON.parse(JSON.stringify(original))
// const target = original.right.right

// console.log(getTargetCopy(original, cloned, target))

var removeDuplicates = function (S) {
  let SArr = S.split('')
  for (let i = 0; i < SArr.length - 1; i++) {
    if (SArr[i] === SArr[i + 1]) {
      SArr.splice(i+1, 1)
      SArr.splice(i, 1)
      if (SArr.length > 0) SArr = removeDuplicates(SArr.join(''))
      else SArr = SArr.join()

      break
    }
  }

  return SArr
};

console.log(removeDuplicates('aaaaaaaa'))
