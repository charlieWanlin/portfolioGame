// ==========================================
// GESTION DES OBJETS COLLECTABLES
// ==========================================
// Définit les classes et instances pour les objets du jeu
// Objets simples (clé, parchemin) et objets animés (coffre)

import { Sprite } from "../sprites.js";
import { ITEMS_POSITIONS } from "../../data/itemsData.js";

// ==========================================
// CLASSE POUR LES OBJETS SIMPLES
// ==========================================
class Item extends Sprite {
  /**
   * Crée un objet collectable simple
   * @param {Object} position - Position {x, y} de l'objet
   * @param {Image} image - Image de l'objet
   * @param {string} name - Nom de l'objet
   * @param {number} width - Largeur (null = auto)
   * @param {number} height - Hauteur (null = auto)
   */
  constructor({ position, image, name, width = null, height = null }) {
    super({
      position: position,
      image: image,
      frames: { max: 1 },
      width: width,
      height: height,
    });

    this.name = name;
    this.collected = false;
  }

  /**
   * Vérifie si le joueur est proche de l'objet
   * @param {Object} player - Référence au joueur
   * @returns {boolean} - True si le joueur est à portée d'interaction
   */
  isNearPlayer(player) {
    if (!player) {
      return false;
    }

    const distanceX = Math.abs(this.position.x - player.position.x);
    const distanceY = Math.abs(this.position.y - player.position.y);

    if (distanceX < 80 && distanceY < 80) {
      return true;
    }

    return false;
  }

  /**
   * Marque l'objet comme collecté
   */
  collect() {
    this.collected = true;
  }

  /**
   * Dessine l'objet seulement s'il n'a pas été collecté
   * @param {CanvasRenderingContext2D} c - Contexte 2D du canvas
   */
  draw(c) {
    if (this.collected === false) {
      super.draw(c);
    }
  }
}

// ==========================================
// CLASSE SPÉCIALE POUR LE COFFRE ANIMÉ
// ==========================================
class ChestItem extends Item {
  /**
   * Crée un coffre avec animation d'ouverture
   * @param {Object} position - Position {x, y} du coffre
   * @param {Image} image - Image statique du coffre fermé
   * @param {Image} spriteSheet - Spritesheet pour l'animation d'ouverture
   * @param {string} name - Nom du coffre
   * @param {number} width - Largeur d'affichage
   * @param {number} height - Hauteur d'affichage
   * @param {number} totalFrames - Nombre total de frames dans l'animation
   */
  constructor({ position, image, spriteSheet, name, width = null, height = null, totalFrames = 8 }) {
    super({ position, image, name, width, height });
    
    // ===== ÉTATS DU COFFRE =====
    this.isOpened = false;           // Le coffre a été ouvert
    this.isAnimating = false;        // Animation en cours
    
    // ===== IMAGES =====
    this.staticImage = image;        // Image du coffre fermé
    this.spriteSheet = spriteSheet;  // Spritesheet de l'animation
    
    // ===== PARAMÈTRES D'ANIMATION =====
    this.currentFrame = 0;           // Frame actuelle de l'animation
    this.totalFrames = totalFrames;  // Nombre total de frames (8)
    this.frameWidth = 48;            // Largeur d'une frame dans la spritesheet
    this.frameHeight = 48;           // Hauteur d'une frame dans la spritesheet
    this.frameCounter = 0;           // Compteur pour ralentir l'animation
    this.frameDelay = 6;             // Délai entre chaque frame (vitesse)
  }

  // ==========================================
  // DÉTECTION DE PROXIMITÉ (Override)
  // ==========================================

  /**
   * Vérifie si le joueur est proche du coffre
   * Version adaptée avec zone de détection plus large
   * @param {Object} player - Référence au joueur
   * @returns {boolean} - True si le joueur est à portée d'interaction
   */
  isNearPlayer(player) {
    if (!player) {
      return false;
    }

    // Calculer le centre du coffre
    const coffreCenterX = this.position.x + this.width / 2;
    const coffreCenterY = this.position.y + this.height / 2;
    
    // Calculer le centre du joueur
    const playerCenterX = player.position.x + player.width / 2;
    const playerCenterY = player.position.y + player.height / 2;
    
    const distanceX = Math.abs(coffreCenterX - playerCenterX);
    const distanceY = Math.abs(coffreCenterY - playerCenterY);

    // Distance augmentée pour couvrir tous les côtés
    return distanceX < 100 && distanceY < 100;
  }

  // ==========================================
  // OUVERTURE DU COFFRE
  // ==========================================

  /**
   * Déclenche l'animation d'ouverture du coffre
   * Ne se déclenche qu'une seule fois
   */
  open() {
    if (!this.isOpened) {
      this.isOpened = true;
      this.isAnimating = true;
      this.currentFrame = 0;
    }
  }

  // ==========================================
  // AFFICHAGE AVEC ANIMATION
  // ==========================================

  /**
   * Dessine le coffre selon son état (fermé, en cours d'ouverture, ou ouvert)
   * Gère l'animation frame par frame
   * @param {CanvasRenderingContext2D} c - Contexte 2D du canvas
   */
  draw(c) {
    // ===== MODE ANIMATION EN COURS =====
    if (this.isAnimating) {
      this.frameCounter++;
      
      // Passer à la frame suivante après le délai
      if (this.frameCounter >= this.frameDelay) {
        this.frameCounter = 0;
        this.currentFrame++;
        
        // Arrêter l'animation à la dernière frame
        if (this.currentFrame >= this.totalFrames) {
          this.currentFrame = this.totalFrames - 1;
          this.isAnimating = false;
        }
      }
      
      // Dessiner la frame actuelle de la spritesheet
      c.drawImage(
        this.spriteSheet,
        this.currentFrame * this.frameWidth,  // Position X dans la spritesheet
        0,                                     // Position Y dans la spritesheet
        this.frameWidth,                       // Largeur source
        this.frameHeight,                      // Hauteur source
        this.position.x,                       // Position X destination
        this.position.y,                       // Position Y destination
        this.width,                            // Largeur destination
        this.height                            // Hauteur destination
      );
    } 
    // ===== MODE COFFRE OUVERT (animation terminée) =====
    else if (this.isOpened) {
      // Afficher la dernière frame (coffre complètement ouvert)
      c.drawImage(
        this.spriteSheet,
        7 * this.frameWidth,  // Dernière frame (index 7)
        0,
        this.frameWidth,
        this.frameHeight,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    } 
    // ===== MODE COFFRE FERMÉ =====
    else {
      // Afficher l'image statique du coffre fermé
      c.drawImage(
        this.staticImage,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }

  /**
   * Override de la méthode collect (le coffre ne disparaît pas)
   */
  collect() {}
}

// ==========================================
// CHARGEMENT DES IMAGES
// ==========================================

// Image du coffre fermé
const coffreImage = new Image();
coffreImage.src = "./img/coffre.png";

// Spritesheet pour l'animation d'ouverture du coffre
const coffreSpriteSheet = new Image();
coffreSpriteSheet.src = "./img/coffreAnimation.png";

// Image de la clé
const cleImage = new Image();
cleImage.src = "./img/key.png";

// Image du parchemin
const parcheminImage = new Image();
parcheminImage.src = "./img/parchemin.png";

// ==========================================
// CRÉATION DES OBJETS
// ==========================================

/**
 * Instance du coffre animé
 * Objet final du jeu, nécessite la clé pour être ouvert
 */
export const coffre = new ChestItem({
  position: {
    x: ITEMS_POSITIONS.coffre.x,
    y: ITEMS_POSITIONS.coffre.y,
  },
  image: coffreImage,
  spriteSheet: coffreSpriteSheet,
  name: "Coffre",
  width: 80,
  height: 80,
  totalFrames: 8,
});

/**
 * Instance de la clé
 * Nécessaire pour ouvrir le coffre
 */
export const cle = new Item({
  position: {
    x: ITEMS_POSITIONS.cle.x,
    y: ITEMS_POSITIONS.cle.y,
  },
  image: cleImage,
  name: "Clé",
  width: 50,
  height: 50,
});

/**
 * Instance du parchemin
 * Contient des informations sur le créateur du jeu
 */
export const parchemin = new Item({
  position: {
    x: ITEMS_POSITIONS.parchemin.x,
    y: ITEMS_POSITIONS.parchemin.y,
  },
  image: parcheminImage,
  name: "Parchemin",
  width: 50,
  height: 50,
});

/**
 * Tableau contenant tous les objets du jeu
 * Utilisé pour les initialisations globales
 */
export const allItems = [coffre, cle, parchemin];