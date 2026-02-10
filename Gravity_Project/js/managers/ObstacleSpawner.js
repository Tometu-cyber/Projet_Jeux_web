import Obstacle from '../entities/Obstacle.js';
import Collectible from '../entities/Collectible.js';

class ObstacleSpawner {
  constructor() {
    this.timeSinceLastSpawn = 0;
    this.spawnInterval = 2.0;
    this.minSpawnInterval = 0.6;
    this.scrollSpeed = 120;
    this.maxScrollSpeed = 500;
    this.canvasWidth = 800;
    this.canvasHeight = 600;
  }

  reset() {
    this.timeSinceLastSpawn = 0;
    this.spawnInterval = 2.0;
    this.scrollSpeed = 120;
  }

  update(deltaTime, obstacles, collectibles, gameTime) {
    this.timeSinceLastSpawn += deltaTime;

    // Augmenter la difficulté progressivement
    this.updateDifficulty(gameTime);

    // Générer un nouvel obstacle si l'intervalle est écoulé
    if (this.timeSinceLastSpawn >= this.spawnInterval) {
      this.spawn(obstacles, collectibles);
      this.timeSinceLastSpawn = 0;
    }
  }

  updateDifficulty(gameTime) {    
    if (gameTime < 15) {
      // Ville - Très lent
      this.scrollSpeed = 120 + (gameTime / 15) * 30;
      this.spawnInterval = 2.0 - (gameTime / 15) * 0.3;
    } else if (gameTime < 30) {
      // Forêt - Lent
      const progress = (gameTime - 15) / 15;
      this.scrollSpeed = 150 + progress * 50;
      this.spawnInterval = 1.7 - progress * 0.3;
    } else if (gameTime < 45) {
      // Océan - Moyen
      const progress = (gameTime - 30) / 15;
      this.scrollSpeed = 200 + progress * 80;
      this.spawnInterval = 1.4 - progress * 0.3;
    } else if (gameTime < 60) {
      // Désert - Rapide
      const progress = (gameTime - 45) / 15;
      this.scrollSpeed = 280 + progress * 80;
      this.spawnInterval = 1.1 - progress * 0.2;
    } else if (gameTime < 90) {
      // Espace - Très rapide
      const progress = (gameTime - 60) / 30;
      this.scrollSpeed = 360 + progress * 90;
      this.spawnInterval = 0.9 - progress * 0.2;
    } else {
      // Enfer - Extrême
      const progress = Math.min((gameTime - 90) / 30, 1);
      this.scrollSpeed = 450 + progress * 50;
      this.spawnInterval = Math.max(0.6, 0.7 - progress * 0.1);
    }
  }

  spawn(obstacles, collectibles) {
    const spawnX = this.canvasWidth + Math.max(50, Math.floor(this.canvasWidth * 0.05));
    
    // Hauteur aléatoire pour la plateforme (adaptée à la taille courante)
    const minY = Math.max(20, Math.floor(this.canvasHeight * 0.12));
    const maxY = Math.max(minY + 40, Math.floor(this.canvasHeight - 20));
    const platformY = Math.random() * (maxY - minY) + minY;
    const platformWidth = Math.floor(Math.max(60, Math.min(140, this.canvasWidth * 0.12)));

    // Créer la plateforme
    const obstacle = new Obstacle(spawnX, platformY, platformWidth, 20, this.scrollSpeed);
    obstacles.push(obstacle);

    // 70% de chance de spawner une étoile au-dessus/en-dessous mais rester à l'intérieur de l'écran
    if (Math.random() < 0.7) {
      const offset = Math.floor(Math.min(60, this.canvasHeight * 0.12));
      const starY = Math.min(Math.max(platformY + (Math.random() < 0.5 ? -offset : offset), 10), this.canvasHeight - 10);
      const starX = spawnX + platformWidth / 2;
      const collectible = new Collectible(starX, starY, this.scrollSpeed);
      collectibles.push(collectible);
    }
  }

  getScrollSpeed() {
    return this.scrollSpeed;
  }
}

export default new ObstacleSpawner();
