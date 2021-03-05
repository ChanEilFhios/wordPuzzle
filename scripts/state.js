let state
const actions = {}

export default state = {
  initializeState: initialState => {
    if (!state) {
      state = initialState
    } else {
      throw new TypeError("State has already been initialized. Please use actions to alter state.")
    }
  },
  registerAction: (action, fn) => {
    actions[action] = fn
  },
  dumpState: () => {
    console.log("State = ", state)
    console.log("Actions = ", actions)
  },
  fire: (action, payload) => {
    if (actions[action]) {
      state = actions[action]({...state}, payload)
    }
  }
}