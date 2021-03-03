export const getRandomIndexFromArray = arr => arr.length * Math.random() << 0
export const getRandomFromArray = arr => arr[getRandomIndexFromArray(arr)]
export const getRandomKeyFromCollection = collection => getRandomFromArray(Object.keys(collection))
