# Gravity Swapper

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Canvas](https://img.shields.io/badge/Canvas_API-FF6B6B?style=for-the-badge&logo=html5&logoColor=white)

> Un jeu HTML5 Canvas où vous défierez la gravité pour survivre le plus longtemps possible !

**Auteur :** COURGENAY Tom - L3 MIAGE - TP3/TD2

---

## 🎮 Présentation

Gravity Swapper est un jeu de plateforme où le joueur peut **inverser la gravité** pour éviter les obstacles, collecter des étoiles et progresser à travers différents paliers de difficulté et thèmes visuels.

**🚀 Pour jouer :** Ouvrez simplement [index.html](index.html) dans votre navigateur !

---

## ✨ Fonctionnalités

- ✅ Menu d'accueil interactif
- ✅ Écran Game Over avec possibilité de rejouer
- ✅ Système de Hi-Scores sauvegardés
- ✅ 3 paliers de difficulté progressive
- ✅ Thèmes visuels évolutifs
- ✅ Collecte d'étoiles pour augmenter le score

---

## 🎯 Contrôles

| Action | Touche |
|--------|--------|
| Se déplacer | ← → (Flèches Gauche/Droite) |
| Inverser la gravité | `Espace` |
| Sauter | ↑ (gravité normale) / ↓ (gravité inversée) |
| Commencer la partie | `Espace` (depuis le menu) |
| Redémarrer | `R` (après Game Over) |

---

## 🏗️ Architecture du projet

### 📁 Structure des fichiers

```
📦 Gravity Swapper
├── 📄 index.html              # Point d'entrée
├── 📂 css/
│   └── style.css              # Styles du jeu
└── 📂 js/
    ├── main.js                # Boucle principale et rendu
    ├── 📂 entities/           # Entités du jeu
    │   ├── Entity.js          # Classe de base
    │   ├── Player.js          # Joueur
    │   ├── Obstacle.js        # Obstacles
    │   └── Collectible.js     # Étoiles collectables
    ├── 📂 managers/           # Gestionnaires
    │   ├── GameStateManager.js
    │   ├── InputManager.js
    │   ├── ScoreManager.js
    │   ├── ThemeManager.js
    │   └── ObstacleSpawner.js
    └── 📂 utils/              # Utilitaires
        └── CollisionDetector.js
```

### 🎨 Bonnes pratiques implémentées

- **Organisation orientée objet** : Classes et héritage (`Entity` → `Player`, `Obstacle`, `Collectible`)
- **Séparation des responsabilités** : Managers dédiés pour chaque aspect du jeu
- **Transformations géométriques** : Usage de `ctx.save()` / `ctx.restore()` et transformations (`translate`, `rotate`)
- **Animation fluide** : Utilisation de `requestAnimationFrame()`
- **Gestion d'états** : State machine pour les différents écrans du jeu
- **Détection de collisions** : Système de résolution physique précis

---

## 🚀 Lancer le jeu

### Option 1 : Direct
Ouvrez simplement `index.html` dans votre navigateur moderne.

---

## 🔧 Difficultés rencontrées et solutions

|              Défi               |
|:-------------------------------:|
| Détection de collisions précise |
|  Équilibrage de la difficulté   |
|     Rendre le jeu attractif     |

---

## 🔮 Améliorations futures

- [ ] Système de vies avec affichage visuel
- [ ] Assets sonores
- [ ] Power-ups et bonus

---

## 📚 Ressources utilisées

- **Cours L3 MIAGE** : Introduction au JavaScript
- **Exemples** : [micbuffa/L3MiageIntroJS2025_2026](https://github.com/micbuffa/L3MiageIntroJS2025_2026)

---

## 🤖 Utilisation d'IA

Utilisation de Copilot dans Visual Studio Code pour accélérer et m'aiguiller dans la rédaction de logique complexe. Et pour la rédaction d'un README clair, structuré et propre.

---

<div align="center">

**🎮 Bon jeu ! 🎮**

</div>