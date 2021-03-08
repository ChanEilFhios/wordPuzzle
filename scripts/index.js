import {getRandomIndexFromArray, getRandomFromArray, sortCharsInStr} from './utilities'
import state from './state'

const collectWords = words => words.map(wordEntry => ({word: wordEntry.word, level: wordEntry.level, guessed: false}))
const collectSubWords = subWords => subWords.flatMap(key => collectWords(allWords[key].words))

function setupGame() {
  const answerWord = getRandomFromArray(nines)
  const answerLetters = answerWord.split('')
  const requiredLetterIndex = getRandomIndexFromArray(answerLetters)
  
  return {
    answerWord,
    requiredLetter: answerLetters[requiredLetterIndex],
    optionalLetters: answerLetters.filter((a, idx) => idx !== requiredLetterIndex),
    words: collectSubWords(allWords[sortCharsInStr(answerWord)].subwords)
        .sort((a, b) => (a.word < b.word) ? -1 : 1),
    guesses: [],
    gameOver: false
  }
}

const attachRenderer = (elementSelector, renderer) => {
  const element = document.body.querySelector(elementSelector)
  return (state => {
    renderer(state, element)
  })
}

window.state = state

state.registerAction("new-word", state => setupGame())
state.registerRenderer(attachRenderer("flower-layout", (state, element) => {
  const optionals = [...state.optionalLetters]
  for (let i = 0; i < element.children.length; i++) {
    if (i === 0) {
      element.children[0].textContent = state.requiredLetter.toUpperCase()
    } else {
      const rndIdx = getRandomIndexFromArray(optionals)

      element.children[i].textContent = optionals[rndIdx].toUpperCase()
      optionals.splice(rndIdx, 1)
    }
  }
}))
state.initializeState(setupGame())
state.dumpState()