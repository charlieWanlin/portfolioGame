// ==========================================
// GESTION DES PERSONNAGES NON-JOUEURS (PNJ)
// ==========================================
// Contient les classes et instances pour tous les PNJ du jeu
// Deux types de PNJ : statiques (avec effet de respiration) et mobiles (avec patrouille)

import { Sprite } from "./sprites.js";
import { NPCS_POSITIONS } from "../data/npcsData.js";

// ==========================================
// CLASSE NPC - PNJ STATIQUES AVEC EFFET DE VIE
// ==========================================
/**
 * PNJ qui reste en place mais avec un effet de "respiration" (léger mouvement vertical)
 * Utilisé pour le Vieil Homme
 */
export class NPC extends Sprite {
  /**
   * Crée un nouveau PNJ statique
   * @param {Object} position - Position {x, y} du PNJ
   * @param {Image} image - Image du PNJ
   * @param {string} name - Nom du PNJ
   * @param {number} animationSpeed - Vitesse de l'effet de respiration
   * @param {number|null} width - Largeur personnalisée (optionnel)
   * @param {number|null} height - Hauteur personnalisée (optionnel)
   */
  constructor({
    position,
    image,
    name,
    animationSpeed,
    width = null,
    height = null,
  }) {
    // Appeler le constructeur de la classe parente (Sprite)
    super({
      position: position,
      image: image,
      frames: { max: 1 }, // Une seule frame (image fixe)
      width: width,
      height: height,
    });

    // ===== PROPRIÉTÉS SPÉCIFIQUES AU PNJ =====
    this.name = name;                   // Nom du PNJ (pour identification)
    this.animationSpeed = animationSpeed; // Vitesse de l'effet de respiration
    
    // ===== GESTION DE L'EFFET DE RESPIRATION =====
    this.frameCounter = 0;              // Compteur de frames pour ralentir l'animation
    this.breathingOffset = 0;           // Décalage vertical actuel (en pixels)
    this.breathingDirection = 1;        // Direction du mouvement (1 = descend, -1 = monte)
  }

  // ==========================================
  // VÉRIFIER SI LE JOUEUR EST À PROXIMITÉ
  // ==========================================
  /**
   * Vérifie si le joueur est assez proche pour interagir
   * @param {Object} player - Objet joueur avec position
   * @returns {boolean} - True si le joueur est à portée d'interaction
   */
  isNearPlayer(player) {
    // Vérification de sécurité
    if (!player) {
      return false;
    }

    // Calculer la distance horizontale et verticale
    const distanceX = Math.abs(this.position.x - player.position.x);
    const distanceY = Math.abs(this.position.y - player.position.y);

    // Le joueur est proche si à moins de 80 pixels dans chaque direction
    if (distanceX < 80 && distanceY < 80) {
      return true;
    }

    return false;
  }

  // ==========================================
  // ANIMER L'EFFET DE RESPIRATION
  // ==========================================
  /**
   * Crée un mouvement de va-et-vient vertical pour simuler la respiration
   */
  animate() {
    // Incrémenter le compteur de frames
    this.frameCounter = this.frameCounter + 1;

    // Mettre à jour l'offset toutes les X frames (selon animationSpeed)
    if (this.frameCounter % this.animationSpeed === 0) {
      // Déplacer le PNJ selon la direction actuelle
      this.breathingOffset += this.breathingDirection;

      // Inverser la direction si on atteint les limites (3 pixels vers le bas ou 0)
      if (this.breathingOffset >= 3) {
        this.breathingDirection = -1; // Commencer à remonter
      } else if (this.breathingOffset <= 0) {
        this.breathingDirection = 1; // Commencer à descendre
      }
    }
  }

  // ==========================================
  // DESSINER LE PNJ AVEC L'EFFET DE RESPIRATION
  // ==========================================
  /**
   * Affiche le PNJ avec le décalage de respiration
   * @param {CanvasRenderingContext2D} c - Contexte du canvas
   */
  draw(c) {
    // Mettre à jour l'animation de respiration
    this.animate();
    
    // Sauvegarder la position Y originale
    const originalY = this.position.y;
    
    // Appliquer le décalage de respiration
    this.position.y += this.breathingOffset;
    
    // Dessiner le sprite (appel à la méthode de la classe parente)
    super.draw(c);
    
    // Restaurer la position Y originale (pour ne pas accumuler le décalage)
    this.position.y = originalY;
  }
}

// ==========================================
// CHARGEMENT DES IMAGES DU VIEIL HOMME
// ==========================================
const oldmanImage = new Image();
oldmanImage.src = "./img/oldman.png";

// ==========================================
// CRÉATION DU VIEIL HOMME
// ==========================================
// Instance unique du Vieil Homme (PNJ avec choix des pilules)
export const oldman = new NPC({
  position: {
    x: NPCS_POSITIONS.oldman.x, // Position depuis le fichier de configuration
    y: NPCS_POSITIONS.oldman.y,
  },
  image: oldmanImage,
  name: "Vieil Homme",
  height: 59,                   // Hauteur personnalisée
  width: 59,                    // Largeur personnalisée
  animationSpeed: 15,           // Vitesse de l'effet de respiration
});

// ==========================================
// CLASSE MOVINGNPC - PNJ QUI SE DÉPLACENT
// ==========================================
/**
 * PNJ avec animations directionnelles et patrouille automatique
 * Utilisé pour le Lapin Blanc
 */
export class MovingNPC extends Sprite {
  /**
   * Crée un nouveau PNJ mobile
   * @param {Object} position - Position initiale {x, y}
   * @param {Image} image - Image par défaut (généralement "down")
   * @param {string} name - Nom du PNJ
   * @param {number} animationSpeed - Vitesse d'animation du sprite
   * @param {number|null} width - Largeur personnalisée
   * @param {number|null} height - Hauteur personnalisée
   * @param {Object|null} sprites - Sprites pour chaque direction {up, down, left, right}
   * @param {Array} pattern - Séquence de déplacements (ex: ["down", "right", "up"])
   * @param {Object} frames - Nombre de frames d'animation {max: nombre}
   * @param {number} scale - Facteur d'échelle
   */
  constructor({
    position,
    image,
    name,
    animationSpeed,
    width = null,
    height = null,
    sprites = null,
    pattern = [],
    frames = { max: 4 },
    scale = 1, 
  }) {
    // Appeler le constructeur de la classe parente (Sprite)
    super({
      position,
      image,
      width,
      height,
      frames,
      scale, 
    });

    // ===== PROPRIÉTÉS SPÉCIFIQUES AU PNJ MOBILE =====
    this.name = name;
    this.animationSpeed = animationSpeed;
    this.frameCounter = 0; // Compteur pour l'animation du sprite
    
    // ===== GESTION DE L'ANIMATION =====
    this.frames = { 
      ...frames, 
      val: 0,      // Frame actuelle
      elapsed: 0   // Frames écoulées
    };
    this.sprites = sprites; // Images pour chaque direction
    
    // ===== GESTION DU DÉPLACEMENT EN PATROUILLE =====
    this.pattern = pattern;           // Séquence de mouvements à répéter
    this.patternIndex = 0;            // Position actuelle dans la séquence
    this.moveCounter = 0;             // Compteur avant le prochain mouvement
    this.moveSpeed = 1;               // Vitesse de déplacement (en tuiles)
    this.stepsBetweenMoves = 60;      // Nombre de frames entre chaque mouvement
  }

  // ==========================================
  // VÉRIFIER SI LE JOUEUR EST À PROXIMITÉ
  // ==========================================
  /**
   * Vérifie si le joueur est assez proche pour interagir
   * @param {Object} player - Objet joueur avec position
   * @returns {boolean} - True si le joueur est à portée d'interaction
   */
  isNearPlayer(player) {
    // Vérification de sécurité
    if (!player) {
      return false;
    }

    // Calculer la distance horizontale et verticale
    const distanceX = Math.abs(this.position.x - player.position.x);
    const distanceY = Math.abs(this.position.y - player.position.y);

    // Le joueur est proche si à moins de 80 pixels dans chaque direction
    if (distanceX < 80 && distanceY < 80) {
      return true;
    }

    return false;
  }

  // ==========================================
  // ANIMER LE SPRITE
  // ==========================================
  /**
   * Gère l'animation du sprite (passage d'une frame à l'autre)
   */
  animate() {
    // Incrémenter le compteur de frames
    this.frameCounter = this.frameCounter + 1;

    // Changer de frame selon la vitesse d'animation
    if (this.frameCounter % this.animationSpeed === 0) {
      // Passer à la frame suivante
      this.frames.val = this.frames.val + 1;

      // Revenir à la première frame si on dépasse le maximum (boucle)
      if (this.frames.val >= this.frames.max) {
        this.frames.val = 0;
      }
    }
  }

  // ==========================================
  // DÉPLACER LE PNJ SELON LA PATROUILLE
  // ==========================================
  /**
   * Gère le déplacement automatique du PNJ selon son pattern de patrouille
   */
  move() {
    // Incrémenter le compteur de mouvement
    this.moveCounter++;

    // Effectuer le prochain mouvement après le délai défini
    if (this.moveCounter >= this.stepsBetweenMoves) {
      // Réinitialiser le compteur
      this.moveCounter = 0;

      // Récupérer la direction actuelle dans le pattern
      const direction = this.pattern[this.patternIndex];

      // Changer le sprite selon la direction (si disponible)
      if (this.sprites && this.sprites[direction]) {
        this.image = this.sprites[direction];
        this.frames.val = 0; // Réinitialiser l'animation
      }

      // Déplacer le PNJ selon la direction
      // Le déplacement est de 48 pixels (taille d'une tuile)
      switch (direction) {
        case "up":
          this.position.y -= this.moveSpeed * 48;
          break;
        case "down":
          this.position.y += this.moveSpeed * 48;
          break;
        case "left":
          this.position.x -= this.moveSpeed * 48;
          break;
        case "right":
          this.position.x += this.moveSpeed * 48;
          break;
      }

      // Passer à la direction suivante dans le pattern
      this.patternIndex++;
      
      // Revenir au début du pattern si on atteint la fin (boucle)
      if (this.patternIndex >= this.pattern.length) {
        this.patternIndex = 0;
      }
    }
  }

  // ==========================================
  // DESSINER LE PNJ MOBILE
  // ==========================================
  /**
   * Affiche le PNJ avec déplacement et animation
   * @param {CanvasRenderingContext2D} c - Contexte du canvas
   */
  draw(c) {
    // Gérer le déplacement en patrouille
    this.move();
    
    // Gérer l'animation du sprite
    this.animate();
    
    // Dessiner le sprite (appel à la méthode de la classe parente)
    super.draw(c);
  }
}

// ==========================================
// CHARGEMENT DES IMAGES DU LAPIN BLANC
// ==========================================
// Images pour chaque direction (spritesheet différent par direction)
const whiteLapinDownImage = new Image();
whiteLapinDownImage.src = "./img/white-rabbit-down.png";

const whiteLapinUpImage = new Image();
whiteLapinUpImage.src = "./img/white-rabbit-up.png";

const whiteLapinLeftImage = new Image();
whiteLapinLeftImage.src = "./img/white-rabbit-left.png";

const whiteLapinRightImage = new Image();
whiteLapinRightImage.src = "./img/white-rabbit-right.png";

// ==========================================
// CRÉATION DU LAPIN BLANC
// ==========================================
// Instance unique du Lapin Blanc (PNJ mobile avec patrouille)
export const whiteLapin = new MovingNPC({
  position: {
    x: 490, // Position de départ X
    y: 490, // Position de départ Y
  },
  image: whiteLapinDownImage, // Image par défaut (regardant vers le bas)
  
  // Sprites pour chaque direction
  sprites: {
    down: whiteLapinDownImage,
    up: whiteLapinUpImage,
    left: whiteLapinLeftImage,
    right: whiteLapinRightImage,
  },
  
  name: "Lapin Blanc",
  width: 170,                   // Largeur du sprite
  height: 148,                  // Hauteur du sprite
  scale: 0.3,                   // Réduire à 30% de la taille originale
  frames: { max: 4 },           // 4 frames d'animation par direction
  animationSpeed: 10,           // Vitesse de l'animation
  
  // Pattern de patrouille : descend, va à droite x6, monte, va à gauche x6, boucle
  pattern: [
    "down",
    "right", "right", "right", "right", "right", "right",
    "up",
    "left", "left", "left", "left", "left", "left",
  ],
});

// ==========================================
// EXPORT DE TOUS LES PNJ
// ==========================================
// Tableau contenant toutes les instances de PNJ pour faciliter leur gestion
export const allNPCs = [oldman, whiteLapin];