let state
const actions = {}
const renderers = []

const fire = (action, payload) => {
  if (actions[action]) {
    state = actions[action]({...state}, payload)
  }
  renderers.forEach(fn => fn(state))
}

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
  fire,
  wireActions: () => {
    const activeElements = document.querySelectorAll('[data-action]')
    
    activeElements.forEach(element => {
      const action = element.getAttribute("data-action")
      const payloadElement = document.getElementById(element.getAttribute("data-payload-field"))
      element.addEventListener("click", ()=> {
        fire(action, payloadElement.value)
      })
    })
  }
}