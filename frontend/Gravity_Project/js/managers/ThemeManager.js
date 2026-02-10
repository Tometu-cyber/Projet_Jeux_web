class ThemeManager {
  constructor() {
    this.themes = [
      {
        name: 'Ville',
        minScore: 0,
        bgColor1: '#1a1a2e',
        bgColor2: '#16213e',
        platformColor: '#e74c3c',
        playerColor: '#3498db',
        starColor: '#ffd700',
        textColor: '#ffffff'
      },
      {
        name: 'Forêt',
        minScore: 50,
        bgColor1: '#1b4332',
        bgColor2: '#2d6a4f',
        platformColor: '#8b4513',
        playerColor: '#95d5b2',
        starColor: '#ffeb3b',
        textColor: '#d8f3dc'
      },
      {
        name: 'Océan',
        minScore: 150,
        bgColor1: '#023047',
        bgColor2: '#126782',
        platformColor: '#fb8500',
        playerColor: '#8ecae6',
        starColor: '#ffd60a',
        textColor: '#caf0f8'
      },
      {
        name: 'Désert',
        minScore: 300,
        bgColor1: '#6d4c3d',
        bgColor2: '#d4a574',
        platformColor: '#bc4749',
        playerColor: '#f2cc8f',
        starColor: '#f77f00',
        textColor: '#ffe5d9'
      },
      {
        name: 'Espace',
        minScore: 500,
        bgColor1: '#0d1b2a',
        bgColor2: '#1b263b',
        platformColor: '#415a77',
        playerColor: '#e0e1dd',
        starColor: '#00ff41',
        textColor: '#e0e1dd'
      },
      {
        name: 'Enfer',
        minScore: 800,
        bgColor1: '#3d0814',
        bgColor2: '#7b113a',
        platformColor: '#ff006e',
        playerColor: '#fb5607',
        starColor: '#ffbe0b',
        textColor: '#ffccd5'
      }
    ];

    this.currentTheme = this.themes[0];
  }

  update(score) {
    // Trouver le thème correspondant au score actuel
    for (let i = this.themes.length - 1; i >= 0; i--) {
      if (score >= this.themes[i].minScore) {
        if (this.currentTheme !== this.themes[i]) {
          this.currentTheme = this.themes[i];
          console.log(`🎨 Nouveau thème: ${this.currentTheme.name} (Score: ${score})`);
        }
        break;
      }
    }
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  reset() {
    this.currentTheme = this.themes[0];
  }

  // Dessiner le background avec gradient
  drawBackground(ctx, canvas) {
    const dpr = Math.max(window.devicePixelRatio || 1, 1);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, this.currentTheme.bgColor1);
    gradient.addColorStop(1, this.currentTheme.bgColor2);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  }

  // Dessiner des éléments décoratifs selon le thème
  drawDecorations(ctx, canvas, gameTime) {
    const theme = this.currentTheme;
    
    switch(theme.name) {
      case 'Ville':
        this.drawStars(ctx, canvas, gameTime, 30, theme.textColor);
        break;
      case 'Forêt':
        this.drawTrees(ctx, canvas);
        break;
      case 'Océan':
        this.drawWaves(ctx, canvas, gameTime);
        break;
      case 'Désert':
        this.drawSun(ctx, canvas);
        break;
      case 'Espace':
        this.drawStars(ctx, canvas, gameTime, 80, theme.starColor);
        this.drawPlanets(ctx, canvas);
        break;
      case 'Enfer':
        this.drawFlames(ctx, canvas, gameTime);
        break;
    }
  }

  drawStars(ctx, canvas, gameTime, count, color) {
    const dpr = Math.max(window.devicePixelRatio || 1, 1);
    const w = Math.max(1, Math.floor(canvas.width / dpr));
    const h = Math.max(1, Math.floor(canvas.height / dpr));

    // Adapter le nombre d'étoiles à la surface : plus de place → plus d'étoiles
    const baseArea = 800 * 600;
    const areaFactor = Math.max(1, Math.floor((w * h) / baseArea));
    const effectiveCount = Math.max(count, count * areaFactor);

    ctx.fillStyle = color;
    for (let i = 0; i < effectiveCount; i++) {
      const t = gameTime * 0.08;

      // Répartition verticale uniforme (garantit couverture du haut jusqu'en bas)
      const yBase = ((i + 0.5) / effectiveCount) * h;
      const y = Math.floor(Math.max(0, Math.min(h - 1, yBase + Math.sin((i + t) * 0.7) * (h * 0.02))));

      // Position X animée
      const x = Math.floor((i * 123 + Math.floor(gameTime * 10)) % w);

      const size = 1 + ((i + Math.floor(gameTime)) % 3);
      ctx.fillRect(x, y, size, size);
    }
  }

  drawTrees(ctx, canvas) {
    ctx.fillStyle = 'rgba(52, 78, 65, 0.3)';
    for (let i = 0; i < 5; i++) {
      const x = i * 200 + 50;
      const y = canvas.height - 100;
      // Tronc
      ctx.fillRect(x, y, 20, 100);
      // Feuillage
      ctx.beginPath();
      ctx.arc(x + 10, y, 40, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawWaves(ctx, canvas, gameTime) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const offset = gameTime * 50 + i * 100;
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height - 50 + Math.sin((x + offset) * 0.02) * 20 + i * 20;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
  }

  drawSun(ctx, canvas) {
    const gradient = ctx.createRadialGradient(700, 100, 20, 700, 100, 80);
    gradient.addColorStop(0, '#ffd60a');
    gradient.addColorStop(1, 'rgba(255, 214, 10, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(620, 20, 160, 160);
  }

  drawPlanets(ctx, canvas) {
    // Grosse planète
    ctx.fillStyle = '#778da9';
    ctx.beginPath();
    ctx.arc(650, 150, 50, 0, Math.PI * 2);
    ctx.fill();
    
    // Anneaux
    ctx.strokeStyle = '#415a77';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.ellipse(650, 150, 70, 20, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawFlames(ctx, canvas, gameTime) {
    ctx.fillStyle = 'rgba(255, 107, 0, 0.3)';
    for (let i = 0; i < 10; i++) {
      const x = (i * 80 + Math.sin(gameTime * 2 + i) * 20) % canvas.width;
      const y = canvas.height - Math.random() * 100;
      const height = 60 + Math.sin(gameTime * 3 + i) * 20;
      
      ctx.beginPath();
      ctx.moveTo(x, canvas.height);
      ctx.quadraticCurveTo(x + 10, y, x + 20, canvas.height);
      ctx.fill();
    }
  }
}

export default new ThemeManager();