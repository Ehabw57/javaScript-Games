export default class InputHandler {
  constructor() {
    this.keys = {};
    this.controlKeys = ['ArrowUp','ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' ', 'Shift']

    window.onkeydown = (e)=> {
      if(this.controlKeys.includes(e.key))
        this.keys[e.key] = true
    }

    window.onkeyup = (e) => {
      if(this.controlKeys.includes(e.key))
        this.keys[e.key] = false
    }
  }
}
      
