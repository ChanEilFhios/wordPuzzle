let state
const actions = {}
const renderers = []

export default {
  initializeState: initialState => {
    if (!state) {
      state = initialState
      renderers.forEach(fn => fn(state))
    } else {
      throw new TypeError("State has already been initialized. Please use actions to alter state.")
    }
  },
  registerAction: (action, fn) => {
    actions[action] = fn
  },
  registerRenderer: renderer => renderers.push(renderer),
  dumpState: () => {
    console.log("State = ", state)
    console.log("Actions = ", actions)
    console.log("Renderers = ", renderers)
  },
  fire: (action, payload) => {
    if (actions[action]) {
      state = actions[action]({...state}, payload)
    }
    renderers.forEach(fn => fn(state))
  }
}