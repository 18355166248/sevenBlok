function longWord(words) {
  words.sort((a, b) => a.length - b.length);
  const wordsSet = new Set(words);

  for (let i = words.length - 1; i >= 0; i--) {
    const word = words[i];
    wordsSet.delete(word);

    if (find(wordsSet, word)) return word;
  }

  return "";
}

function find(set, word) {
  if (!word || word.length === 0) return true;

  for (let i = 0; i < word.length; i++) {
    if (set.has(word.substring(0, i + 1)) && find(set, word.substring(i + 1)))
      return true;
  }
}

const a = ["cat", "banana", "dog", "nana", "walk", "walker", "dogwalker"];

console.log(longWord(a));
