import Entity from './Entity.js';

export default class Obstacle extends Entity {
  constructor(x, y, width, height, scrollSpeed = 200) {
    super(x, y, width, height);
    this.color = '#e74c3c';
    this.scrollSpeed = scrollSpeed;
  }

  update(deltaTime) {
    // Défilement vers la gauche
    this.x -= this.scrollSpeed * deltaTime;
  }

  isOffScreen() {
    return this.x + this.width < 0;
  }

  draw(ctx) {
    ctx.save();
    
    // Translation vers la position
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    
    // Dessin en (0, 0)
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    
    ctx.restore();
  }
}