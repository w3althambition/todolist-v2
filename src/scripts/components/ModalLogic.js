
/**
 * This component handles the modal logic. It serves
 * to open the modal, process entered data and pass
 * it to the app manager using a custom event.
 */

class ModalLogic {
  constructor(_target) {
    this.target = document.querySelector(_target)
    this.closeBtn = this.target.querySelector('[data-close-btn]')
    this.background = this.target.querySelector('[data-background]')
    this.allInputs = this.target.querySelectorAll('input')
    this.nameInput = this.target.querySelector('[data-name-input]')
    this.prioInput = this.target.querySelector('[data-prio-input]')
    this.dateInput = this.target.querySelector('[data-date-input]')
    this.validationText = this.target.querySelector('[data-vali-text]')
  }

  closeModal() {
    this.target.classList.remove('active')
    this.target.classList.remove('success')
    this.target.classList.remove('error')
  }

  pushModalInputs() {
    // This reformats data we get from
    // the input field to what we want
    // in our small array database.
    const reOrderDate = () => {
      const dataArr = this.dateInput.value.split('-')
      return `${dataArr[2]}/${dataArr[1]}/${dataArr[0].slice(-2)}`
    }

    // We push the event with custom event
    // which will get picked up by the app
    // manager component which will add the
    // entry to the array and call the task
    // manager component which will update
    // the tasks.
    document.body.dispatchEvent(new CustomEvent('pushModalTask', {
    detail: {
      name: this.nameInput.value,
      prio: this.prioInput.value,
      date: reOrderDate(),
      },
    }))
  }

  // On modal initlization add all
  // the nesscary event listeners.
  modalInitEvents() {
    this.closeBtn.addEventListener('click', () => {
      this.closeModal()
    })

    this.background.addEventListener('click', () => {
      this.closeModal()
    })

    document.body.addEventListener('updateTaskInput', (e) => {
      this.dateInput.value = new Date().toISOString().substr(0, 10)
      this.nameInput.value = e.detail.name
    })

    this.allInputs.forEach((input) => {
      const currentInput = input
      if (input.type !== 'submit') {
        currentInput.addEventListener('keypress', (e) => {
          const key = e.charCode || e.keyCode || 0
          if (key === 13) {
            e.preventDefault()
          }
        })
      }

      if (input.type === 'submit') {
        currentInput.addEventListener('click', (e) => {
          e.preventDefault()
          this.fromValidation()
        })
      }
    })
  }

  // Validate if the submitted inputs are
  // as they should be. If not give a small
  // notification feedback on the result.
  fromValidation() {
    let error = false

    this.allInputs.forEach((input) => {
      if (input.type !== 'submit') {
        if (error === true) return
        if (input.value === '') {
          error = true
        }
      }
    })

    this.target.classList.add('modal-info')
    if (error === false) {
      this.target.classList.add('success')
      this.validationText.innerText = 'Task was added! :)'
      setTimeout(() => {
        this.target.classList.remove('modal-info')
        this.pushModalInputs()
        this.closeModal()
      }, 1000)
    } else {
      this.target.classList.add('error')
      this.validationText.innerText = 'Please fill all fields.'
      setTimeout(() => {
        this.target.classList.remove('modal-info')
      }, 2000)
    }
  }

  onLoad() {
    this.modalInitEvents()
  }
}

export default ModalLogic
