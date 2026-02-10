export const GameStates = {
  MENU: 'menu',
  PLAYING: 'playing',
  GAME_OVER: 'gameover'
};

class GameStateManager {
  constructor() {
    this.currentState = GameStates.MENU;
  }

  setState(newState) {
    console.log(`État changé : ${this.currentState} → ${newState}`);
    this.currentState = newState;
  }

  getState() {
    return this.currentState;
  }

  isPlaying() {
    return this.currentState === GameStates.PLAYING;
  }
}

export default new GameStateManager();
