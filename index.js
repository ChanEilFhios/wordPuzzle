window.customElements.define('quiz-answer', class extends HTMLElement {
  _updateDisplay() {
    if (this.show === "true") {
      this.answerSpan.textContent = this.answer
    } else {
      this.answerSpan.textContent = this.answer.replace(/[a-z]/ig, "-")
    }
  }

  constructor() {
    super()
    this.attachShadow({mode:"open"})
    this.shadowRoot.innerHTML = `
      <style>
        .correct {
          color: green;
        }

        .incorrect {
          color: red;
        }
      </style>
      <span></span>
    `

    this.answerSpan = this.shadowRoot.querySelector("span")
  }

  connectedCallback() {
    this._updateDisplay()
  }

  get answer() {
    return this.getAttribute('answer')
  }

  set answer(newAnswer) {
    this.setAttribute('answer', newAnswer)
  }

  get show() {
    return this.getAttribute('show') ?? 'false'
  }

  set show(shouldShow) {
    this.setAttribute('show', shouldShow)
  }

  get status() {
    if (this.answerSpan.classList.contains('correct')) {
      return "correct"
    } else if (this.answerSpan.classList.contains('incorrect')) {
      return "incorrect"
    }

    return "unanswered"
  }

  set status(newStatus) {
    this.answerSpan.className = ''
    this.answerSpan.classList.add(newStatus)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "status") {
      this.status = newValue
    }
    this._updateDisplay()
  }
  
  static get observedAttributes() { return ['show', 'answer', 'status']; }
})