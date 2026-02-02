// ==========================================
// GESTION DE L'INVENTAIRE
// ==========================================
// Gère les objets collectés par le joueur (logique + affichage visuel)

class Inventory {
  constructor() {
    // ===== ÉTAT LOGIQUE DE L'INVENTAIRE =====
    // Stocke les objets possédés par le joueur (true = possédé, false = non possédé)
    this.items = {
      cle: false,        // Clé mystérieuse (pour ouvrir le coffre)
      parchemin: false,  // Lettre de motivation
      coffre: false,     // Coffre ouvert (marque la fin du jeu)
    };

    // ===== ÉLÉMENTS DOM DE L'INVENTAIRE VISUEL =====
    // Conteneur principal de l'inventaire (dans la Gameboy)
    this.inventaireContainer = document.querySelector('.inventaire');
    
    // Éléments individuels pour chaque item (icônes)
    this.inventaireElements = {
      cle: document.querySelector('[data-item="cle"]'),
      parchemin: document.querySelector('[data-item="parchemin"]')
    };
  }

  // ========================================
  // ACTIVER L'INVENTAIRE VISUEL
  // ========================================
  /**
   * Active l'affichage de l'inventaire quand le jeu démarre
   * (cache l'inventaire dans le menu, l'affiche en jeu)
   */
  activerInventaire() {
    if (this.inventaireContainer) {
      this.inventaireContainer.classList.add('game-started');
    }
  }

  // ========================================
  // AJOUTER UN ITEM À L'INVENTAIRE
  // ========================================
  /**
   * Ajoute un item à l'inventaire (logique + affichage visuel)
   * 
   * @param {string} itemName - Nom de l'item à ajouter ('cle', 'parchemin', 'coffre')
   * @returns {boolean} - True si ajouté avec succès, false sinon
   */
  addItem(itemName) {
    // Vérifier que l'item existe dans la liste
    if (this.items.hasOwnProperty(itemName)) {
      // Marquer l'item comme possédé
      this.items[itemName] = true;
      
      // Afficher visuellement l'item (uniquement pour clé et parchemin)
      // Le coffre n'a pas d'affichage visuel car il marque la fin du jeu
      if (itemName === 'cle' || itemName === 'parchemin') {
        this.afficherItemVisuel(itemName);
      }
      
      return true;
    }
    return false; // Item inconnu
  }

  // ========================================
  // AFFICHER L'ITEM DANS L'INVENTAIRE VISUEL
  // ========================================
  /**
   * Rend visible l'icône d'un item dans l'inventaire de la Gameboy
   * Ajoute une animation de collecte
   * 
   * @param {string} itemName - Nom de l'item à afficher ('cle' ou 'parchemin')
   */
  afficherItemVisuel(itemName) {
    const inventaireItem = this.inventaireElements[itemName];
    
    if (inventaireItem) {
      // Rendre l'item visible (passe de grisé à coloré)
      inventaireItem.classList.add('collected');
      
      // Ajouter l'animation de collecte (shake, glow, etc.)
      inventaireItem.classList.add('animating');
      
      // Retirer l'animation après 1.5 secondes
      setTimeout(() => {
        inventaireItem.classList.remove('animating');
      }, 1500);
    }
  }

  // ========================================
  // VÉRIFIER SI LE JOUEUR POSSÈDE UN ITEM
  // ========================================
  /**
   * Vérifie si un item a été collecté
   * Utilisé pour vérifier les conditions (ex: a-t-on la clé pour ouvrir le coffre ?)
   * 
   * @param {string} itemName - Nom de l'item à vérifier
   * @returns {boolean} - True si l'item est possédé, false sinon
   */
  hasItem(itemName) {
    return this.items[itemName] === true;
  }

  // ========================================
  // OBTENIR L'INVENTAIRE COMPLET
  // ========================================
  /**
   * Retourne l'état complet de l'inventaire
   * Utile pour la sauvegarde ou le debug
   * 
   * @returns {Object} - Objet contenant tous les items et leur état
   */
  getInventory() {
    return this.items;
  }

  // ========================================
  // VIDER L'INVENTAIRE (RESET)
  // ========================================
  /**
   * Réinitialise l'inventaire (logique + visuel)
   * Utilisé pour le bouton "Rejouer" ou au démarrage d'une nouvelle partie
   */
  viderInventaire() {
    // ===== RÉINITIALISER LA LOGIQUE =====
    this.items = {
      cle: false,
      parchemin: false,
      coffre: false,
    };

    // ===== RÉINITIALISER L'AFFICHAGE VISUEL =====
    // Retirer les classes 'collected' et 'animating' de tous les items
    Object.values(this.inventaireElements).forEach(item => {
      if (item) {
        item.classList.remove('collected', 'animating');
      }
    });
    
    // Désactiver l'inventaire visuel (retour à l'état menu)
    if (this.inventaireContainer) {
      this.inventaireContainer.classList.remove('game-started');
    }
  }
}

export default Inventory;