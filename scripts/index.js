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
state.registerRenderer(attachRenderer("#layout-answers", (state, element) => {
  let child
  const oldChildren = []

  while (child = element.firstElementChild) {
    oldChildren.push(element.removeChild(child))
  }

  state.words.reduce((existing, word) => {
    if (existing[0]?.answer === word.word) {
      element.appendChild(existing[0])
    } else {
      const newChild = document.createElement('quiz-answer', {is: 'quiz-answer'})
      newChild.answer = word.word

      element.appendChild(newChild)
    }

    return existing.slice(1)
  }, oldChildren)
}))

state.initializeState(setupGame())
state.dumpState()