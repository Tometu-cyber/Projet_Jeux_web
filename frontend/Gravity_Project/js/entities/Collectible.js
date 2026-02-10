import Entity from './Entity.js';

export default class Collectible extends Entity {
  constructor(x, y, scrollSpeed = 200) {
    super(x, y, 20, 20); // Plus petit que les obstacles
    this.collected = false;
    this.color = '#ffd700'; // Or
    this.points = 10;
    this.scrollSpeed = scrollSpeed;
    
    // Animation
    this.angle = 0;
    this.rotationSpeed = 3;
  }

  update(deltaTime) {
    if (!this.collected) {
      this.angle += this.rotationSpeed * deltaTime;
      this.x -= this.scrollSpeed * deltaTime;
    }
  }

  isOffScreen() {
    return this.x + this.width < 0;
  }

  draw(ctx, theme) {
    if (this.collected) return;
    
    ctx.save();
    
    // Translation vers la position
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    
    // Rotation
    ctx.rotate(this.angle);
    
    // Dessiner une étoile
    ctx.fillStyle = theme ? theme.starColor : this.color;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const x = Math.cos(angle) * 10;
      const y = Math.sin(angle) * 10;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }

  collect() {
    this.collected = true;
    return this.points;
  }
}
