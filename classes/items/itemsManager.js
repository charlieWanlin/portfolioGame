// ==========================================
// CLASSE ITEMSMANAGER - GESTION DES OBJETS DU JEU
// ==========================================
// Gère la collecte et l'interaction avec les objets (clé, parchemin, coffre)
// Coordonne l'inventaire, les overlays et les animations

import audioManager from "../../utils/audio.js";

export class ItemsManager {
  /**
   * Crée une nouvelle instance du gestionnaire d'objets
   * @param {Object} items - Collection des objets du jeu (cle, parchemin, coffre)
   * @param {Object} player - Référence au joueur
   * @param {Object} overlayManager - Gestionnaire des overlays (popups)
   * @param {Function} rectangularCollision - Fonction de détection de collision
   * @param {Object} inventory - Référence à l'inventaire visuel
   */
  constructor(items, player, overlayManager, rectangularCollision, inventory) {
    this.items = items;
    this.player = player;
    this.overlayManager = overlayManager;
    this.rectangularCollision = rectangularCollision;
    this.inventory = inventory;

    // ===== ÉTATS DES OBJETS ET INTERACTIONS =====
    this.states = {
      // États de collecte
      keyCollected: false,
      parcheminCollected: false,
      coffreOpened: false,
      
      // États d'interaction (proximité)
      canInteractWithKey: false,
      canInteractWithParchemin: false,
      canInteractWithCoffre: false,
      
      // États d'affichage des indices
      showKeyHint: false,
      showParcheminHint: false,
      showCoffreHint: false,
    };
  }

  // ==========================================
  // INITIALISATION
  // ==========================================

  /**
   * Active l'inventaire au démarrage du jeu
   * Rend l'interface de l'inventaire visible
   */
  activerInventaire() {
    this.inventory.activerInventaire();
  }

  // ==========================================
  // BOUCLE PRINCIPALE
  // ==========================================

  /**
   * Met à jour l'état des interactions à chaque frame
   * Vérifie la proximité du joueur avec chaque objet
   */
  update() {
    this.checkKeyInteraction();
    this.checkParcheminInteraction();
    this.checkCoffreInteraction();
  }

  /**
   * Dessine tous les objets et leurs indices à chaque frame
   * @param {CanvasRenderingContext2D} c - Contexte 2D du canvas
   */
  draw(c) {
    // ===== DESSINER LA CLÉ =====
    if (!this.states.keyCollected) {
      this.items.cle.draw();
      this.drawKeyHint(c);
    }

    // ===== DESSINER LE PARCHEMIN =====
    if (!this.states.parcheminCollected) {
      this.items.parchemin.draw();
      this.drawParcheminHint(c);
    }

    // ===== DESSINER LE COFFRE =====
    if (!this.states.coffreOpened) {
      this.items.coffre.draw();
      this.drawCoffreHint(c);
    } else {
      // Déplacer le coffre hors écran après ouverture
      this.items.coffre.position.x = -1000;
      this.items.coffre.position.y = -1000;
    }
  }

  // ==========================================
  // DÉTECTION DES COLLISIONS
  // ==========================================

  /**
   * Vérifie si le joueur est proche de la clé
   * Active les états d'interaction et d'affichage de l'indice
   */
  checkKeyInteraction() {
    if (
      !this.states.keyCollected &&
      this.rectangularCollision({
        rectangle1: this.player,
        rectangle2: this.items.cle,
      })
    ) {
      this.states.canInteractWithKey = true;
      this.states.showKeyHint = true;
    } else {
      this.states.canInteractWithKey = false;
      this.states.showKeyHint = false;
    }
  }

  /**
   * Vérifie si le joueur est proche du parchemin
   * Active les états d'interaction et d'affichage de l'indice
   */
  checkParcheminInteraction() {
    if (
      !this.states.parcheminCollected &&
      this.rectangularCollision({
        rectangle1: this.player,
        rectangle2: this.items.parchemin,
      })
    ) {
      this.states.canInteractWithParchemin = true;
      this.states.showParcheminHint = true;
    } else {
      this.states.canInteractWithParchemin = false;
      this.states.showParcheminHint = false;
    }
  }

  /**
   * Vérifie si le joueur est proche du coffre
   * Active les états d'interaction et d'affichage de l'indice
   */
  checkCoffreInteraction() {
    if (
      !this.states.coffreOpened &&
      this.rectangularCollision({
        rectangle1: this.player,
        rectangle2: this.items.coffre,
      })
    ) {
      this.states.canInteractWithCoffre = true;
      this.states.showCoffreHint = true;
    } else {
      this.states.canInteractWithCoffre = false;
      this.states.showCoffreHint = false;
    }
  }

  // ==========================================
  // AFFICHAGE DES INDICES
  // ==========================================

  /**
   * Affiche l'indice d'interaction pour la clé
   * Visible uniquement quand le joueur est proche
   * @param {CanvasRenderingContext2D} c - Contexte 2D du canvas
   */
  drawKeyHint(c) {
    if (!this.states.showKeyHint || this.states.keyCollected) return;

    c.fillStyle = "white";
    c.font = "16px Arial";
    c.fillText(
      itemsConfig.cle.hintText,
      this.items.cle.position.x,
      this.items.cle.position.y - 10
    );
  }

  /**
   * Affiche l'indice d'interaction pour le parchemin
   * Visible uniquement quand le joueur est proche
   * @param {CanvasRenderingContext2D} c - Contexte 2D du canvas
   */
  drawParcheminHint(c) {
    if (!this.states.showParcheminHint || this.states.parcheminCollected) return;

    c.fillStyle = "white";
    c.font = "16px Arial";
    c.fillText(
      itemsConfig.parchemin.hintText,
      this.items.parchemin.position.x,
      this.items.parchemin.position.y - 10
    );
  }

  /**
   * Affiche l'indice d'interaction pour le coffre
   * Message différent selon que la clé a été collectée ou non
   * @param {CanvasRenderingContext2D} c - Contexte 2D du canvas
   */
  drawCoffreHint(c) {
    if (!this.states.showCoffreHint || this.states.coffreOpened) return;

    c.fillStyle = "white";
    c.font = "16px Arial";

    // Message adapté : verrouillé ou déverrouillé
    const message = !this.states.keyCollected
      ? itemsConfig.coffre.hintTextLocked
      : itemsConfig.coffre.hintTextUnlocked;

    c.fillText(message, this.items.coffre.position.x, this.items.coffre.position.y - 10);
  }

  // ==========================================
  // GESTION DES INTERACTIONS
  // ==========================================

  /**
   * Gère l'interaction du joueur avec les objets (touche E)
   * Vérifie l'objet le plus proche et déclenche l'action appropriée
   * @returns {boolean} - True si une interaction a eu lieu
   */
  handleInteraction() {
    // ===== INTERACTION AVEC LA CLÉ =====
    if (this.states.canInteractWithKey && !this.states.keyCollected) {
      this.collectKey();
      return true;
    }

    // ===== INTERACTION AVEC LE PARCHEMIN =====
    if (this.states.canInteractWithParchemin && !this.states.parcheminCollected) {
      this.collectParchemin();
      return true;
    }

    // ===== INTERACTION AVEC LE COFFRE =====
    if (this.states.canInteractWithCoffre && !this.states.coffreOpened) {
      // Le coffre ne s'ouvre que si le joueur possède la clé
      if (this.states.keyCollected) {
        this.openCoffre();
        return true;
      }
    }

    return false;
  }

  // ==========================================
  // ACTIONS DE COLLECTE
  // ==========================================

  /**
   * Collecte la clé
   * Met à jour l'état, l'inventaire et affiche l'overlay
   */
  collectKey() {
    this.states.keyCollected = true;
    this.inventory.addItem('cle');
    this.overlayManager.openKey();
  }

  /**
   * Collecte le parchemin
   * Met à jour l'état, l'inventaire et affiche l'overlay
   */
  collectParchemin() {
    this.states.parcheminCollected = true;
    this.inventory.addItem('parchemin');
    this.overlayManager.openParchemin();
  }

  /**
   * Ouvre le coffre (action finale du jeu)
   * Met à jour l'état, l'inventaire, affiche l'overlay et lance la musique de fin
   */
  openCoffre() {
    this.states.coffreOpened = true;
    this.inventory.addItem('coffre');
    this.overlayManager.openCoffre();
    audioManager.playEndMusic();
  }

  // ==========================================
  // UTILITAIRES
  // ==========================================

  /**
   * Retourne la liste des objets encore visibles dans le jeu
   * Utilisé pour le défilement de la carte (parallax)
   * @returns {Array} - Tableau des objets non collectés
   */
  getMovables() {
    const movables = [];
    
    if (!this.states.keyCollected) {
      movables.push(this.items.cle);
    }
    
    if (!this.states.parcheminCollected) {
      movables.push(this.items.parchemin);
    }
    
    if (!this.states.coffreOpened) {
      movables.push(this.items.coffre);
    }
    
    return movables;
  }

  /**
   * Vérifie si un overlay est actuellement ouvert
   * @returns {boolean} - True si un overlay est visible
   */
  isOverlayOpen() {
    return this.overlayManager.isOpen();
  }
}