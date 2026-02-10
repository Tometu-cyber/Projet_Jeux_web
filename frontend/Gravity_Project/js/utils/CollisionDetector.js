class CollisionDetector {
  /**
   * Vérifie la collision entre deux rectangles (AABB)
   */
  checkRectCollision(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  /**
   * Résout la collision entre le joueur et une plateforme
   * Retourne true si le joueur peut se poser sur la plateforme
   */
  resolvePlatformCollision(player, platform) {
    const playerRect = player.getRect();
    const platformRect = platform.getRect();

    if (!this.checkRectCollision(playerRect, platformRect)) {
      return false;
    }

    // Calculer les distances de chevauchement
    const overlapLeft = (playerRect.x + playerRect.width) - platformRect.x;
    const overlapRight = (platformRect.x + platformRect.width) - playerRect.x;
    const overlapTop = (playerRect.y + playerRect.height) - platformRect.y;
    const overlapBottom = (platformRect.y + platformRect.height) - playerRect.y;

    // Trouver le plus petit chevauchement
    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

    // Résoudre en fonction de la direction
    if (player.gravityDirection === 1) { // Gravité normale (vers le bas)
      // Atterrir sur le dessus de la plateforme
      if (minOverlap === overlapTop && player.vy >= 0) {
        player.y = platformRect.y - playerRect.height;
        player.vy = 0;
        player.onGround = true;
        return true;
      }
      // Bloquer la tête contre le dessous de la plateforme
      if (minOverlap === overlapBottom && player.vy < 0) {
        player.y = platformRect.y + platformRect.height;
        player.vy = 0;
        return false;
      }
    } else { // Gravité inversée (vers le haut)
      // Atterrir sous la plateforme
      if (minOverlap === overlapBottom && player.vy <= 0) {
        player.y = platformRect.y + platformRect.height;
        player.vy = 0;
        player.onGround = true;
        return true;
      }
      // Bloquer la tête contre le dessus de la plateforme
      if (minOverlap === overlapTop && player.vy > 0) {
        player.y = platformRect.y - playerRect.height;
        player.vy = 0;
        return false;
      }
    }

    // Collision latérale = retourner 'lateral' pour indiquer une collision fatale
    if (minOverlap === overlapLeft || minOverlap === overlapRight) {
      return 'lateral';
    }

    return false;
  }
}

export default new CollisionDetector();
