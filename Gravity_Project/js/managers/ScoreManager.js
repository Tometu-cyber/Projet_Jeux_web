import { upsertUserBestScore, getUserBestScore, getGlobalBestScore } from '../services/ScoreService.js';
import { getSessionUser } from '../services/AuthService.js';

class ScoreManager {
  constructor() {
    this.stars = 0;
    this.highScore = 0;
    this.gameId = 'gravity_swapper';
  }

  async init() {
    const user = getSessionUser();
    if (user) {
      const { data } = await getUserBestScore(user.id, this.gameId);
      if (data && data.best_score) this.highScore = data.best_score;
    } else {
      const { data } = await getGlobalBestScore(this.gameId);
      if (data && data.best_score) this.highScore = data.best_score;
    }
  }

  addStar() {
    this.stars++;
  }

  calculateScore(gameTime) {
    return Math.floor((gameTime / 2) * this.stars);
  }

  reset() {
    this.stars = 0;
  }

  getStars() {
    return this.stars;
  }

  getScore(gameTime) {
    return this.calculateScore(gameTime);
  }

  async updateHighScore(gameTime) {
    const currentScore = this.calculateScore(gameTime);
    const user = getSessionUser();
    if (user) {
      const { data } = await upsertUserBestScore(user.id, this.gameId, currentScore, this.stars);
      if (data && data.best_score) this.highScore = Math.max(this.highScore, data.best_score);
    } else {
      // Fallback local
      if (currentScore > this.highScore) {
        this.highScore = currentScore;
        try { localStorage.setItem('gravitySwapperHighScore', this.highScore); } catch (e) {}
      }
    }
  }

  getHighScore() {
    return this.highScore;
  }
}

export default new ScoreManager();