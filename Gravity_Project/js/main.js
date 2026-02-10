import InputManager from './managers/InputManager.js';
import GameStateManager, { GameStates } from './managers/GameStateManager.js';
import Player from './entities/Player.js';
import Obstacle from './entities/Obstacle.js';
import CollisionDetector from './utils/CollisionDetector.js';
import ScoreManager from './managers/ScoreManager.js';
import ObstacleSpawner from './managers/ObstacleSpawner.js';
import ThemeManager from './managers/ThemeManager.js';

// CONSTANTES
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Resize helper : adapte la taille du canvas au conteneur et gère DPR
function resizeCanvas() {
  const dpr = Math.max(window.devicePixelRatio || 1, 1);
  const rect = canvas.parentElement.getBoundingClientRect();
  const cssWidth = Math.max(1, Math.floor(rect.width || window.innerWidth * 0.9));
  const cssHeight = Math.max(1, Math.floor(rect.height || Math.min(window.innerHeight * 0.9, cssWidth * 0.75)));

  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;

  canvas.width = Math.floor(cssWidth * dpr);
  canvas.height = Math.floor(cssHeight * dpr);

  // Mettre à l'échelle le contexte pour que les coordonnées restent en CSS pixels
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Renseigner le spawner avec les dimensions CSS (utilisées pour calculer spawn hors-écran)
  ObstacleSpawner.canvasWidth = cssWidth;
  ObstacleSpawner.canvasHeight = cssHeight;
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', resizeCanvas);

// VARIABLES GLOBALES
let lastTime = 0;
let player;
let obstacles = [];
let collectibles = [];
let gameTime = 0;

// BOUCLE PRINCIPALE
function gameLoop(timestamp) {
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  // Dessiner le background avec le thème actuel
  ThemeManager.drawBackground(ctx, canvas);
  ThemeManager.drawDecorations(ctx, canvas, gameTime);

  // Gestion des états
  switch (GameStateManager.getState()) {
    case GameStates.MENU:
      drawMenu();
      handleMenuInput();
      break;
    case GameStates.PLAYING:
      updateGame(deltaTime);
      drawGame();
      handleGameInput();
      break;
    case GameStates.GAME_OVER:      ScoreManager.updateHighScore(gameTime);      drawGameOver();
      handleGameOverInput();
      break;
  }

  // Reset des touches "just pressed"
  InputManager.reset();

  // Rappeler gameLoop
  requestAnimationFrame(gameLoop);
}

// MENU
function drawMenu() {
  ctx.fillStyle = 'white';
  ctx.font = '48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('GRAVITY SWAPPER', canvas.width / 2, canvas.height / 2 - 50);
  
  ctx.font = '24px Arial';
  ctx.fillText('Press SPACE to start', canvas.width / 2, canvas.height / 2 + 20);
}

function handleMenuInput() {
  if (InputManager.isKeyJustPressed(' ')) {
    GameStateManager.setState(GameStates.PLAYING);
  }
}

// JEU
function updateGame(deltaTime) {
  // Incrémenter le timer
  gameTime += deltaTime;

  // Mettre à jour le thème en fonction du score
  const currentScore = ScoreManager.getScore(gameTime);
  ThemeManager.update(currentScore);

  // UPDATE
  player.update(deltaTime, InputManager, canvas);
  obstacles.forEach(obstacle => obstacle.update(deltaTime));
  collectibles.forEach(collectible => collectible.update(deltaTime));

  // Spawner de nouveaux obstacles
  ObstacleSpawner.update(deltaTime, obstacles, collectibles, gameTime);

  // Nettoyer les objets hors écran
  obstacles = obstacles.filter(obstacle => !obstacle.isOffScreen());
  collectibles = collectibles.filter(collectible => !collectible.isOffScreen() || collectible.collected);

  // COLLISIONS AVEC PLATEFORMES
  obstacles.forEach(obstacle => {
    const result = CollisionDetector.resolvePlatformCollision(player, obstacle);
    if (result === 'lateral') {
      // Collision latérale = Game Over
      GameStateManager.setState(GameStates.GAME_OVER);
    }
  });

  // COLLISIONS AVEC COLLECTIBLES
  collectibles.forEach(collectible => {
    if (!collectible.collected && CollisionDetector.checkRectCollision(player.getRect(), collectible.getRect())) {
      collectible.collect();
      ScoreManager.addStar();
    }
  });
}

function drawGame() {
  // Dessiner les obstacles
  obstacles.forEach(obstacle => obstacle.draw(ctx, ThemeManager.getCurrentTheme()));
  
  // Dessiner les collectibles
  collectibles.forEach(collectible => collectible.draw(ctx, ThemeManager.getCurrentTheme()));
  
  // Dessiner le joueur
  player.draw(ctx, ThemeManager.getCurrentTheme());

  // UI - Timer
  const theme = ThemeManager.getCurrentTheme();
  ctx.fillStyle = theme.textColor;
  ctx.font = '28px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`⏱️ ${gameTime.toFixed(1)}s`, 10, 35);
  
  // Nom du thème
  ctx.font = '20px Arial';
  ctx.fillStyle = theme.textColor;
  ctx.fillText(`🌍 ${theme.name}`, 10, canvas.height - 15);
  
  // Score
  ctx.font = '24px Arial';
  ctx.fillStyle = theme.starColor;
  ctx.fillText(`⭐ ${ScoreManager.getStars()} | Score: ${ScoreManager.getScore(gameTime)}`, 10, 65);
  
  // High Score (plus petit, en haut à droite)
  ctx.font = '16px Arial';
  ctx.textAlign = 'right';
  ctx.fillStyle = '#888';
  ctx.fillText(`Best Score: ${ScoreManager.getHighScore()}`, canvas.width - 10, 25);
}

function handleGameInput() {
  // Inversion de gravité
  if (InputManager.isKeyJustPressed(' ')) {
    player.invertGravity();
  }
}

// GAME OVER
function drawGameOver() {
  // Redessiner le jeu en arrière-plan (figé)
  drawGame();
  
  // Overlay semi-transparent
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Texte Game Over
  ctx.fillStyle = '#e74c3c';
  ctx.font = '56px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 80);
  
  // Stats finales
  ctx.fillStyle = 'white';
  ctx.font = '28px Arial';
  ctx.fillText(`⏱️ Survie: ${gameTime.toFixed(1)}s`, canvas.width / 2, canvas.height / 2 - 40);
  
  ctx.font = '24px Arial';
  ctx.fillStyle = '#ffd700';
  ctx.fillText(`⭐ Étoiles: ${ScoreManager.getStars()}`, canvas.width / 2, canvas.height / 2);
  
  ctx.font = '36px Arial';
  ctx.fillStyle = '#00ff88';
  ctx.fillText(`Score: ${ScoreManager.getScore(gameTime)}`, canvas.width / 2, canvas.height / 2 + 45);
  
  ctx.font = '20px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText('Press R to restart', canvas.width / 2, canvas.height / 2 + 90);
}

function handleGameOverInput() {
  if (InputManager.isKeyJustPressed('r')) {
    // Reset complet
    ScoreManager.reset();
    gameTime = 0;
    ObstacleSpawner.reset();
    ThemeManager.reset();
    player = new Player(100, 300);
    obstacles = [];
    collectibles = [];
    
    // Spawner quelques obstacles de départ
    obstacles.push(new Obstacle(400, 500, 100, 20, 120));
    obstacles.push(new Obstacle(600, 350, 120, 20, 120));
    
    GameStateManager.setState(GameStates.PLAYING);
  }
}

// DÉMARRAGE
async function init() {
  console.log('🎮 Gravity Swapper - Mode Infini');
  
  // Redimensionnement initial
  resizeCanvas();

  // Initialiser le score manager (récupère high score user/global)
  try { await ScoreManager.init(); } catch (e) { console.warn('ScoreManager init failed', e); }

  // Créer le joueur (position fixe à gauche, centré verticalement)
  player = new Player(100, Math.floor(canvas.clientHeight * 0.5));
  
  // Obstacles de départ (positions relatives à la taille du canvas)
  obstacles = [
    new Obstacle(Math.floor(canvas.clientWidth * 0.5), Math.floor(canvas.clientHeight * 0.85), 100, 20, 120),
    new Obstacle(Math.floor(canvas.clientWidth * 0.8), Math.floor(canvas.clientHeight * 0.6), 120, 20, 120)
  ];
  
  collectibles = [];
  
  requestAnimationFrame(gameLoop);
}

// Lancer le jeu quand le DOM est prêt
window.addEventListener('DOMContentLoaded', init);