export const getRandomIndexFromArray = arr => arr.length * Math.random() << 0
export const getRandomFromArray = arr => arr[getRandomIndexFromArray(arr)]
export const getRandomKeyFromCollection = collection => getRandomFromArray(Object.keys(collection))
export const sortCharsInStr = str => str.split('').sort().join('')
export const randomizeArray = arr => arr.reduce((randomArr, elem, idx) => {
  const randomIdx = idx + (randomArr.length - idx) * Math.random() << 0

  randomArr[idx] = randomArr[randomIdx]
  randomArr[randomIdx] = elem

  return randomArr
}, arr)