let state
const actions = {}
const renderers = []

const fetchPayload = (elementId, parent) => {
  const payloadElement = document.getElementById(elementId) ?? parent

  return () => {
    if (payloadElement) {
      const value = payloadElement.value.toLowerCase()
      payloadElement.value = ''
      return value
    }
  }
}

const eventResponders = {
  click: element => {
    const getPayload = fetchPayload(element.getAttribute("data-action-payload"))
    return () => fire(element.getAttribute("data-action"), getPayload())
  },
  keyup: element => {
    const getPayload = fetchPayload(element.getAttribute("data-action-payload"), element)
    const key = element.getAttribute("data-action-keycode")
    return (event) => {
      if (event.key === key) {
        fire(element.getAttribute("data-action"), getPayload())
      }
    }
  }
}

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
      const event = element.getAttribute("data-action-event")
      element.addEventListener(event, eventResponders[event](element))
    })
  }
}