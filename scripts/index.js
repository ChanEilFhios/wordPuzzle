import {getRandomIndexFromArray, getRandomFromArray, sortCharsInStr} from './utilities'

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
        guesses: []
    }
}

console.log(setupGame())