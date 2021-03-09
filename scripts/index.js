import {randomizeArray, getRandomIndexFromArray, getRandomFromArray, sortCharsInStr} from './utilities'
import state from './state'

const collectWords = (words, requiredLetter) => words
.filter(wordEntry => wordEntry.word.includes(requiredLetter))
.map(wordEntry => ({word: wordEntry.word, level: wordEntry.level, guessed: false}))
const collectSubWords = (subWords, requiredLetter) => subWords.flatMap(key => collectWords(allWords[key].words, requiredLetter))

function setupGame() {
  const answerWord = getRandomFromArray(nines)
  const answerLetters = answerWord.split('')
  const requiredLetterIndex = getRandomIndexFromArray(answerLetters)
  
  return {
    answerWord,
    requiredLetter: answerLetters[requiredLetterIndex],
    optionalLetters: randomizeArray(answerLetters.filter((a, idx) => idx !== requiredLetterIndex)),
    words: collectSubWords(allWords[sortCharsInStr(answerWord)].subwords, answerLetters[requiredLetterIndex])
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
state.registerAction("end-game", state => ({...state, gameOver: true}))
state.registerAction("guess", (state, payload) => {
  const foundIdx = state.words.findIndex(word => word.word === payload)
  let wasGuessed = false

  if (foundIdx > -1 && !state.gameOver) {
    wasGuessed = state.words[foundIdx].guessed
    state.words[foundIdx].guessed = true
  }

  state.guesses.unshift({
    guess: payload,
    correct: foundIdx > -1,
    repeat: wasGuessed
  })

  return state
})

state.registerRenderer(attachRenderer("flower-layout", (state, element) => {
  for (let i = 0; i < element.children.length; i++) {
    if (i === 0) {
      element.children[0].textContent = state.requiredLetter.toUpperCase()
    } else {
      element.children[i].textContent = state.optionalLetters[i-1].toUpperCase()
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
    let newChild

    if (existing[0]?.answer === word.word) {
      newChild = existing[0]
      existing = existing.slice(1)
    } else {
      newChild = document.createElement('quiz-answer', {is: 'quiz-answer'})
      newChild.answer = word.word.toUpperCase()
      if (word.word.length === 9) {
        newChild.classList.add("nine")
      }
    }

    if (word.guessed || state.gameOver) {
      newChild.show = "true"
      newChild.status = word.guessed ? 'correct' : 'incorrect'
      if (state.gameOver) {
        newChild.answer = `${word.word.toUpperCase()}(${word.level})`
      }
    }
    element.appendChild(newChild)

    return existing
  }, oldChildren)
}))
state.registerRenderer(attachRenderer('#guesses', (state, element) => {
  element.innerHTML = state.guesses.slice(0, 10).map(guess => `<p>${guess.guess}</p>`).join('')
}))

state.initializeState(setupGame())
state.wireActions()

state.dumpState()