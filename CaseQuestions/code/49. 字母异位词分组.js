// 给定一个字符串数组，将字母异位词组合在一起。字母异位词指字母相同，但排列不同的字符串。

var groupAnagrams = function(strs) {
  const map = new Map();

  for (const str of strs) {
    let array = Array.from(str);
    array = array.sort();
    const key = array.toString();
    const list = map.get(key) ? map.get(key) : [];
    list.push(str);
    map.set(key, list); 
  }

  return [...map.values()];
};

console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));
// [["ate", "eat", "tea"], ["nat", "tan"], ["bat"]]
// console.log(groupAnagrams(["", "b", ""]));
// console.log(groupAnagrams(["ddddddddddg", "dgggggggggg"]));
