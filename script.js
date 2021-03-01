const maxWordLength = 9
const byRank = {
  a: {
    found: 0,
    total: 0
  },
  b: {
    found: 0,
    total: 0
  },
  c: {
    found: 0,
    total: 0
  },
  d: {
    found: 0,
    total: 0
  }
}
//General utility functions
const getRandomIndexFromArray = arr => arr.length * Math.random() << 0
const getRandomFromArray = arr => arr[getRandomIndexFromArray(arr)]
const getRandomKeyFromCollection = collection => getRandomFromArray(Object.keys(collection))

//Commonly used DOM Elements
const guessInput = document.getElementById("input-guess")
const optionalLetters = document.querySelectorAll(".display-optional")
const requiredLetter = document.getElementById("display-required")
const answers = document.getElementById("display-answers")
const answerCount = document.getElementById("display-count")
const checkButton = document.getElementById("input-check")
const resetButton = document.getElementById("input-reset")
const showButton = document.getElementById("input-show")
const correct = document.getElementById("display-correct")
const incorrect = document.getElementById("display-incorrect")
const repeat = document.getElementById("display-repeat")
const rankDisplay = document.getElementById("display-stats")

const sortCharsInStr = str => str.split('').sort().join('')

const getBlankAnswerDOMElements = (wordList) =>
  wordList
  .sort()
  .reduce((answers, wordEntry) => {
    const {word, level} = wordEntry
    const answer = document.createElement("span")
    answer.textContent = word.replace(/[a-z]/ig, "-")
    answer.id = word
    answer.level = level
    byRank[level].total ++ 
    answer.found = false
    answer.classList.add("display-answers")
    answers.appendChild(answer)

    return answers
  }, document.createDocumentFragment())

const collectAnswers = (requiredLetter, selectedKey, words) => {
  const answers = []

  return words[selectedKey].subwords
  .filter(subwordKey => subwordKey.includes(requiredLetter))
  .reduce((answers, subwordKey) => {
    answers.push(...words[subwordKey].words)
    return answers
  }, answers)
  .sort((a, b) => {
    const aWord = a.word
    const bWord = b.word
    if (aWord < bWord) {
      return -1
    } else if (aWord === bWord) {
      return 0
    }

    return 1
  })
}

const selectRequiredLetter = (letterString) => {
  const letters = letterString.split('')
  const requiredLetterIndex = getRandomIndexFromArray(letters)

  return letters.reduce((acc, letter, idx) => {
    if (idx === requiredLetterIndex) {
      acc.requiredLetter = letter
    } else {
      acc.optionalLetters.push(letter)
    }
    return acc
  }, {optionalLetters: []})
}

const setupGame = (words, nines) => {
  byRank.a.total = 0
  byRank.a.found = 0
  byRank.b.total = 0
  byRank.b.found = 0
  byRank.c.total = 0
  byRank.c.found = 0
  byRank.d.total = 0
  byRank.d.found = 0

  const selectedKey = sortCharsInStr(getRandomFromArray(nines))
  const {requiredLetter, optionalLetters} = selectRequiredLetter(selectedKey)
  return {
    selectedKey,
    requiredLetter,
    optionalLetters,
    answers: collectAnswers(requiredLetter, selectedKey, words)
  }
}

const displayByRank = () => {
  const createRankSpan = level => {
    const rankSpan = document.createElement('span')
    rankSpan.textContent = `
    ${level.toUpperCase()} - ${byRank[level].found}/${byRank[level].total} (${(byRank[level].found/byRank[level].total * 100).toFixed(0)}%)`

    return rankSpan
  }
  while (rankDisplay.firstChild) rankDisplay.removeChild(rankDisplay.lastChild)
  rankDisplay.appendChild(createRankSpan('a'))
  rankDisplay.appendChild(createRankSpan('b'))
  rankDisplay.appendChild(document.createElement('br'))
  rankDisplay.appendChild(createRankSpan('c'))
  rankDisplay.appendChild(createRankSpan('d'))
}

const displayGame = (gameState) => {
  console.log(gameState)
  requiredLetter.textContent = gameState.requiredLetter.toUpperCase()
  optionalLetters.forEach((optionalLetter, idx) => {
    optionalLetter.textContent = gameState.optionalLetters[idx].toUpperCase() || '-'
  })
  while (answers.firstChild) answers.removeChild(answers.lastChild)
  answers.appendChild(getBlankAnswerDOMElements(gameState.answers))
  answerCount.textContent = gameState.answers.length
  displayByRank()
}

const displayGuessFeedback = status => {
  correct.hidden = (status !== "correct")
  incorrect.hidden = (status !== "incorrect")
  repeat.hidden = (status !== "repeat")
}

const validateGuess = () => {
  const guess = guessInput.value
  try {
    const answer = document.getElementById(guess)
    answer.textContent = guess
    displayGuessFeedback(answer.found ? "repeat" : "correct")
    if (!answer.found) {
      byRank[answer.level].found ++
    }
    answer.found = true
    answer.classList.add((guess.length == maxWordLength) ? "nine" : "notnine")
  } catch (e) {
    //ignore errors. Yes, I'm absolutely being lazy.
    displayGuessFeedback("incorrect")
  }
  guessInput.value = ""
  displayByRank()
}

const showAnswers = () => {
  for (answer of answers.children) {
    answer.textContent = `${answer.id}(${answer.level})`
    answer.classList.add((answer.id.length == maxWordLength) ? "nine" : "notnine")
    answer.classList.add(answer.found ? "found" : "notfound")
  }
}

const startGame = () => displayGame(setupGame(allWords, nines))

guessInput.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault()
    validateGuess()
  }
});
checkButton.addEventListener("click", validateGuess)
resetButton.addEventListener("click", startGame)
showButton.addEventListener("click", showAnswers)

startGame()
