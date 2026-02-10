import Entity from './Entity.js';

export default class Player extends Entity {
  constructor(x, y) {
    super(x, y, 30, 30); // Taille du joueur
    
    this.vx = 0;
    this.vy = 0;
    this.speed = 300;
    this.jumpForce = 400;
    
    this.gravity = 800;
    this.gravityDirection = 1;
    
    this.onGround = false;
    this.isInverted = false;
    
    this.angle = 0;
    this.targetAngle = 0;
    this.rotationSpeed = 10;
  }

  /**
   * Mise à jour du joueur
   */
  update(deltaTime, inputManager, canvas) {
    // ===== DÉPLACEMENT HORIZONTAL =====
    this.vx = 0;
    if (inputManager.isKeyPressed('ArrowLeft')) {
      this.vx = -this.speed;
    }
    if (inputManager.isKeyPressed('ArrowRight')) {
      this.vx = this.speed;
    }

    // Gravité normale : flèche haut pour sauter
    // Gravité inversée : flèche bas pour sauter
    if (this.gravityDirection === 1 && inputManager.isKeyPressed('ArrowUp') && this.onGround) {
      this.vy = -this.jumpForce * this.gravityDirection;
      this.onGround = false;
    } else if (this.gravityDirection === -1 && inputManager.isKeyPressed('ArrowDown') && this.onGround) {
      this.vy = -this.jumpForce * this.gravityDirection;
      this.onGround = false;
    }

    // ===== GRAVITÉ =====
    this.vy += this.gravity * this.gravityDirection * deltaTime;

    // ===== MISE À JOUR POSITION =====
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;

    // ===== COLLISIONS AVEC LES BORDS =====
    // Gauche / Droite
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvas.width) {
      this.x = canvas.width - this.width;
    }

    // Sol / Plafond
    if (this.gravityDirection === 1) { // Gravité normale
      // Sol
      if (this.y + this.height >= canvas.height) {
        this.y = canvas.height - this.height;
        this.vy = 0;
        this.onGround = true;
      }
      // Plafond (empêcher de sortir par le haut)
      if (this.y < 0) {
        this.y = 0;
        this.vy = Math.max(0, this.vy); // Annuler la vitesse vers le haut
      }
    } else { // Gravité inversée
      // Plafond (maintenant le sol)
      if (this.y <= 0) {
        this.y = 0;
        this.vy = 0;
        this.onGround = true;
      }
      // Sol (empêcher de sortir par le bas)
      if (this.y + this.height > canvas.height) {
        this.y = canvas.height - this.height;
        this.vy = Math.min(0, this.vy); // Annuler la vitesse vers le bas
      }
    }

    // ===== ANIMATION DE ROTATION =====
    // Interpolation vers l'angle cible
    if (Math.abs(this.angle - this.targetAngle) > 0.01) {
      this.angle += (this.targetAngle - this.angle) * this.rotationSpeed * deltaTime;
    } else {
      this.angle = this.targetAngle;
    }
  }

  /**
   * Inverser la gravité
   */
  invertGravity() {
    this.gravityDirection *= -1;
    this.isInverted = !this.isInverted;
    this.onGround = false;
    
    // Définir l'angle cible pour l'animation
    this.targetAngle = this.isInverted ? Math.PI : 0;
  }

  /**
   * Dessin du joueur avec transformations géométriques
   */
  draw(ctx, theme) {
    ctx.save();
    
    // 1. Translation vers la position du joueur
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    
    // 2. Rotation autour du centre
    ctx.rotate(this.angle);
    
    // 3. Dessin du joueur EN (0, 0) !!!
    ctx.fillStyle = theme ? theme.playerColor : '#00ffa6';
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    
    // Ajouter un indicateur de direction (petit triangle)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -this.height / 2 + 5);
    ctx.lineTo(-5, -this.height / 2 + 10);
    ctx.lineTo(5, -this.height / 2 + 10);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }
}
