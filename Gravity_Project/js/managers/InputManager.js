// ===========================
// INPUT MANAGER
// ===========================
// Centralise tous les événements clavier

class InputManager {
  constructor() {
    this.keys = {};
    this.keyJustPressed = {};
    
    this.setupListeners();
  }

  setupListeners() {
    window.addEventListener('keydown', (e) => {
      if (!this.keys[e.key]) {
        this.keyJustPressed[e.key] = true;
      }
      this.keys[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
      this.keyJustPressed[e.key] = false;
    });
  }

  isKeyPressed(key) {
    return this.keys[key] || false;
  }

  isKeyJustPressed(key) {
    const pressed = this.keyJustPressed[key] || false;
    this.keyJustPressed[key] = false; // Reset
    return pressed;
  }

  reset() {
    this.keyJustPressed = {};
  }
}

export default new InputManager();