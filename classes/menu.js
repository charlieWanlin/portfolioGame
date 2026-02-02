// ==========================================
// CLASSE MENU - GESTION DU MENU DU JEU
// ==========================================
// Gère l'affichage et les interactions du menu principal et de la sélection de personnage
// États possibles : "PRINCIPAL", "SELECTION_PERSO", "JEU"

import audioManager from "../utils/audio.js";

export class Menu {
  /**
   * Crée une nouvelle instance du menu
   * @param {HTMLCanvasElement} canvas - Élément canvas du jeu
   * @param {CanvasRenderingContext2D} c - Contexte 2D du canvas
   */
  constructor(canvas, c) {
    this.canvas = canvas;
    this.c = c;

    // ===== ÉTAT DU MENU =====
    // États possibles : "PRINCIPAL", "SELECTION_PERSO", "JEU"
    this.state = "PRINCIPAL";

    // ===== CHARGEMENT DES IMAGES =====
    
    // Image de fond du menu principal
    this.fondImage = new Image();
    this.fondImage.src = "./img/ecranDemarrage.jpg";

    // Images des personnages pour la sélection
    this.playerDownImage = new Image();
    this.playerDownImage.src = "./img/playerDown.png"; // Personnage féminin

    this.player2DownImage = new Image();
    this.player2DownImage.src = "./img/player2Down.png"; // Personnage masculin

    // ===== DÉFINITION DES BOUTONS DU MENU PRINCIPAL =====
    this.boutons = {
      jouer: { 
        x: 412, 
        y: 250, 
        width: 200, 
        height: 50, 
        text: "JOUER" 
      },
      aPropos: { 
        x: 412, 
        y: 320, 
        width: 200, 
        height: 50, 
        text: "À PROPOS" 
      },
      makingOf: { 
        x: 412, 
        y: 390, 
        width: 200, 
        height: 50, 
        text: "MAKING OF" 
      },
    };

    // ===== ÉTAT DE L'INTERFACE =====
    this.boutonSurvole = null;        // Bouton actuellement survolé par la souris
    this.personnageChoisi = null;     // Personnage sélectionné (null, "feminin", ou "masculin")

    // ===== RÉCUPÉRATION DES OVERLAYS HTML =====
    
    // Overlay Making Of
    this.makingofOverlay = document.getElementById("makingof-overlay");
    this.makingofBtn = document.getElementById("makingof-close-btn");

    // Overlay À Propos
    this.aproposOverlay = document.getElementById("apropos-overlay");
    this.aproposBtn = document.getElementById("apropos-close-btn");

    // ===== ÉVÉNEMENTS DE FERMETURE DES OVERLAYS =====
    
    // Événement pour fermer le Making Of
    if (this.makingofBtn) {
      this.makingofBtn.addEventListener("click", () => {
        this.makingofOverlay.classList.add("hidden");
      });
    }

    // Événement pour fermer À Propos
    if (this.aproposBtn) {
      this.aproposBtn.addEventListener("click", () => {
        this.aproposOverlay.classList.add("hidden");
      });
    }

    // ===== ÉVÉNEMENTS SOURIS SUR LE CANVAS =====
    
    // Lier les méthodes au contexte de la classe (pour garder 'this')
    this.handleClickBound = (e) => this.handleClick(e);
    this.handleMouseMoveBound = (e) => this.handleMouseMove(e);

    // Attacher les événements au canvas
    this.canvas.addEventListener("click", this.handleClickBound);
    this.canvas.addEventListener("mousemove", this.handleMouseMoveBound);
  }

  // ==========================================
  // RÉINITIALISER LE MENU
  // ==========================================
  /**
   * Remet le menu à son état initial (retour au menu principal)
   * Utilisé quand le joueur retourne au menu depuis le jeu
   */
  reset() {
    this.state = "PRINCIPAL";             // Retour au menu principal
    this.personnageChoisi = null;          // Réinitialiser le choix de personnage
    this.boutonSurvole = null;             // Aucun bouton survolé
    this.onJouerClick = null;              // Réinitialiser le callback
    audioManager.backToMenu();             // Relancer la musique du menu
  }

  // ==========================================
  // VÉRIFIER SI UN POINT EST DANS UN RECTANGLE
  // ==========================================
  /**
   * Vérifie si les coordonnées (x, y) sont à l'intérieur d'un rectangle
   * Utilisé pour détecter les clics sur les boutons
   * 
   * @param {number} x - Coordonnée X du point
   * @param {number} y - Coordonnée Y du point
   * @param {Object} rect - Rectangle {x, y, width, height}
   * @returns {boolean} - True si le point est dans le rectangle
   */
  isInside(x, y, rect) {
    return (
      x >= rect.x &&
      x <= rect.x + rect.width &&
      y >= rect.y &&
      y <= rect.y + rect.height
    );
  }

  // ==========================================
  // MÉTHODE PRINCIPALE DE DESSIN
  // ==========================================
  /**
   * Dessine le menu selon l'état actuel
   * Appelée à chaque frame tant que le menu est affiché
   */
  draw() {
    if (this.state === "PRINCIPAL") {
      this.drawMenuPrincipal();
    } else if (this.state === "SELECTION_PERSO") {
      this.drawSelectionPersonnage();
    } else if (this.state === "JEU") {
      // Le menu n'est plus affiché, le jeu a pris le relais
      return;
    }
  }

  // ==========================================
  // DESSINER LE MENU PRINCIPAL
  // ==========================================
  /**
   * Affiche le menu principal avec le titre et les boutons
   * (JOUER, À PROPOS, MAKING OF)
   */
  drawMenuPrincipal() {
    // ===== FOND D'ÉCRAN =====
    this.c.drawImage(
      this.fondImage,
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );

    // ===== TITRE PRINCIPAL =====
    this.c.fillStyle = "#FFD700"; // Couleur dorée
    this.c.font = "bold 60px Arial";
    this.c.textAlign = "center";
    this.c.fillText("DÉCOUVRE-MOI", this.canvas.width / 2, 150);

    // ===== SOUS-TITRE =====
    this.c.fillStyle = "#FFF"; // Blanc
    this.c.font = "40px Arial";
    this.c.fillText("Un portfolio interactif", this.canvas.width / 2, 210);

    // ===== BOUTONS DU MENU =====
    // Dessiner tous les boutons (JOUER, À PROPOS, MAKING OF)
    Object.values(this.boutons).forEach((bouton) => {
      // Passer true si le bouton est survolé pour changer son apparence
      this.drawBouton(bouton, bouton === this.boutonSurvole);
    });
  }

  // ==========================================
  // DESSINER LA SÉLECTION DE PERSONNAGE
  // ==========================================
  /**
   * Affiche l'écran de sélection du personnage
   * Permet de choisir entre le personnage féminin et masculin
   */
  drawSelectionPersonnage() {
    // ===== FOND NOIR SEMI-TRANSPARENT =====
    this.c.fillStyle = "rgba(0, 0, 0, 0.8)";
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // ===== TITRE DE LA PAGE =====
    this.c.fillStyle = "#FFD700"; // Couleur dorée
    this.c.font = "bold 40px Arial";
    this.c.textAlign = "center";
    this.c.fillText("CHOISISSEZ VOTRE PERSONNAGE", this.canvas.width / 2, 100);

    // ===== CONFIGURATION DES BOÎTES DE PERSONNAGE =====
    const boxWidth = 200;       // Largeur de chaque boîte
    const boxHeight = 280;      // Hauteur de chaque boîte
    const spacing = 150;        // Espace entre les deux boîtes
    
    // Calculer la position X de départ pour centrer les deux boîtes
    const startX = (this.canvas.width - (boxWidth * 2 + spacing)) / 2;
    const startY = 160;         // Position Y fixe

    // ===== BOÎTE PERSONNAGE FÉMININ (à gauche) =====
    this.drawPersonnageBox(
      startX,
      startY,
      boxWidth,
      boxHeight,
      "FÉMININ",
      this.personnageChoisi === "feminin", // true si sélectionné
      this.playerDownImage,
    );

    // ===== BOÎTE PERSONNAGE MASCULIN (à droite) =====
    this.drawPersonnageBox(
      startX + boxWidth + spacing,
      startY,
      boxWidth,
      boxHeight,
      "MASCULIN",
      this.personnageChoisi === "masculin", // true si sélectionné
      this.player2DownImage,
    );

    // ===== BOUTON RETOUR (en bas à gauche) =====
    const btnRetour = {
      x: this.canvas.width / 2 - 310,
      y: 500,
      width: 200,
      height: 50,
      text: "RETOUR",
    };
    this.drawBouton(btnRetour, false);

    // ===== BOUTON JOUER (en bas à droite) =====
    // Affiché seulement si un personnage a été choisi
    if (this.personnageChoisi) {
      const btnJouer = {
        x: this.canvas.width / 2 + 110,
        y: 500,
        width: 200,
        height: 50,
        text: "JOUER",
      };
      this.drawBouton(btnJouer, false);
    }
  }

  // ==========================================
  // DESSINER UNE BOÎTE DE SÉLECTION DE PERSONNAGE
  // ==========================================
  /**
   * Affiche une boîte de sélection avec l'aperçu du personnage
   * 
   * @param {number} x - Position X de la boîte
   * @param {number} y - Position Y de la boîte
   * @param {number} width - Largeur de la boîte
   * @param {number} height - Hauteur de la boîte
   * @param {string} nom - Nom du personnage ("FÉMININ" ou "MASCULIN")
   * @param {boolean} selectionne - True si ce personnage est sélectionné
   * @param {Image} image - Image du personnage à afficher
   */
  drawPersonnageBox(x, y, width, height, nom, selectionne, image) {
    const c = this.c;

    // ===== FOND DE LA BOÎTE =====
    // Change de couleur si le personnage est sélectionné
    c.fillStyle = selectionne
      ? "rgba(255, 215, 0, 0.2)"   // Fond doré si sélectionné
      : "rgba(50, 50, 50, 0.8)";   // Fond gris sinon
    c.fillRect(x, y, width, height);

    // ===== BORDURE DE LA BOÎTE =====
    // Bordure dorée épaisse si sélectionné, grise fine sinon
    c.strokeStyle = selectionne ? "#FFD700" : "#888";
    c.lineWidth = selectionne ? 4 : 2;
    c.strokeRect(x, y, width, height);

    // ===== NOM DU PERSONNAGE (en bas de la boîte) =====
    c.fillStyle = selectionne ? "#FFD700" : "#FFF";
    c.font = "bold 24px Arial";
    c.textAlign = "center";
    c.fillText(nom, x + width / 2, y + height - 20);

    // ===== ZONE D'APERÇU DU PERSONNAGE =====
    const previewWidth = width - 50;
    const previewHeight = height - 100;
    const previewX = x + 25;
    const previewY = y + 30;

    // Fond de la zone d'aperçu (gris foncé)
    c.fillStyle = "#666";
    c.fillRect(previewX, previewY, previewWidth, previewHeight);

    // ===== DESSINER L'IMAGE DU PERSONNAGE =====
    // Vérifier que l'image est complètement chargée
    if (image.complete && image.naturalHeight !== 0) {
      const imageScale = 2;                        // Facteur d'agrandissement
      const imgWidth = (image.width / 4) * imageScale;  // Largeur (1/4 car spritesheet)
      const imgHeight = image.height * imageScale;      // Hauteur

      // Centrer l'image dans la zone d'aperçu
      const imgX = previewX + (previewWidth - imgWidth) / 2 + 15;
      const imgY = previewY + (previewHeight - imgHeight) / 2 - 10;

      // Dessiner la première frame du personnage (regardant vers le bas)
      c.drawImage(
        image,
        0,                  // Position X source (première frame)
        0,                  // Position Y source
        image.width / 4,    // Largeur source (1/4 de la spritesheet)
        image.height,       // Hauteur source
        imgX,               // Position X destination
        imgY,               // Position Y destination
        imgWidth,           // Largeur destination
        imgHeight,          // Hauteur destination
      );
    }
  }

  // ==========================================
  // DESSINER UN BOUTON
  // ==========================================
  /**
   * Affiche un bouton avec effet de survol
   * 
   * @param {Object} bouton - Objet bouton {x, y, width, height, text}
   * @param {boolean} survole - True si le bouton est survolé par la souris
   */
  drawBouton(bouton, survole) {
    const c = this.c;

    // ===== FOND DU BOUTON =====
    // Change d'apparence si survolé
    if (survole) {
      c.fillStyle = "rgba(255, 215, 0, 0.3)"; // Fond doré transparent
    } else {
      c.fillStyle = "rgba(0, 0, 0, 0.6)";     // Fond noir transparent
    }
    c.fillRect(bouton.x, bouton.y, bouton.width, bouton.height);

    // ===== BORDURE DU BOUTON =====
    c.strokeStyle = survole ? "#FFD700" : "#DAA520"; // Doré vif ou terne
    c.lineWidth = survole ? 4 : 2;                   // Plus épais si survolé
    c.strokeRect(bouton.x, bouton.y, bouton.width, bouton.height);

    // ===== TEXTE DU BOUTON =====
    c.fillStyle = survole ? "#FFD700" : "#FFFFFF";   // Doré ou blanc
    c.font = survole ? "bold 24px Arial" : "bold 20px Arial"; // Plus gros si survolé
    c.textAlign = "center";
    c.fillText(
      bouton.text,
      bouton.x + bouton.width / 2,
      bouton.y + bouton.height / 2 + 8,
    );
  }

  // ==========================================
  // GESTION DES CLICS SOURIS
  // ==========================================
  /**
   * Gère les clics sur le canvas (boutons, personnages)
   * 
   * @param {MouseEvent} e - Événement de clic souris
   * @returns {string|null} - Nom du personnage choisi ou null
   */
  handleClick(e) {
    // ===== CONVERSION DES COORDONNÉES ÉCRAN → CANVAS =====
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // ===== CLICS SUR LE MENU PRINCIPAL =====
    if (this.state === "PRINCIPAL") {
      // Bouton JOUER → Passer à la sélection de personnage
      if (this.isInside(x, y, this.boutons.jouer)) {
        this.state = "SELECTION_PERSO";
        return;
      }

      // Bouton À PROPOS → Afficher l'overlay À Propos
      if (this.isInside(x, y, this.boutons.aPropos)) {
        this.aproposOverlay.classList.remove("hidden");
        return;
      }

      // Bouton MAKING OF → Afficher l'overlay Making Of
      if (this.isInside(x, y, this.boutons.makingOf)) {
        this.makingofOverlay.classList.remove("hidden");
        return;
      }
    }

    // ===== CLICS SUR LA SÉLECTION DE PERSONNAGE =====
    else if (this.state === "SELECTION_PERSO") {
      // ===== CONFIGURATION DES POSITIONS =====
      const boxWidth = 200;
      const boxHeight = 280;
      const spacing = 150;
      const startX = (this.canvas.width - (boxWidth * 2 + spacing)) / 2;
      const startY = 160;

      // ===== BOUTON RETOUR =====
      const btnRetour = {
        x: this.canvas.width / 2 - 310,
        y: 500,
        width: 200,
        height: 50,
      };

      // Clic sur RETOUR → Retour au menu principal
      if (this.isInside(x, y, btnRetour)) {
        this.state = "PRINCIPAL";
        this.personnageChoisi = null;
        return;
      }

      // ===== CLIC SUR BOÎTE FÉMININ =====
      if (
        x >= startX &&
        x <= startX + boxWidth &&
        y >= startY &&
        y <= startY + boxHeight
      ) {
        this.personnageChoisi = "feminin";
        return;
      }

      // ===== CLIC SUR BOÎTE MASCULIN =====
      const mascX = startX + boxWidth + spacing;
      if (
        x >= mascX &&
        x <= mascX + boxWidth &&
        y >= startY &&
        y <= startY + boxHeight
      ) {
        this.personnageChoisi = "masculin";
        return;
      }

      // ===== BOUTON JOUER (visible seulement si personnage choisi) =====
      if (this.personnageChoisi) {
        const btnJouer = {
          x: this.canvas.width / 2 + 110,
          y: 500,
          width: 200,
          height: 50,
        };

        // Clic sur JOUER → Lancer le jeu avec le personnage choisi
        if (this.isInside(x, y, btnJouer)) {
          audioManager.playGameMusic(); // Passer à la musique du jeu
          return this.personnageChoisi; // Retourner le personnage choisi
        }
      }
    }

    return null; // Aucune action déclenchée
  }

  // ==========================================
  // GESTION DU SURVOL DE LA SOURIS
  // ==========================================
  /**
   * Gère le survol des boutons pour changer l'apparence du curseur
   * et mettre en surbrillance les boutons
   * 
   * @param {MouseEvent} e - Événement de mouvement de souris
   */
  handleMouseMove(e) {
    // ===== CONVERSION DES COORDONNÉES ÉCRAN → CANVAS =====
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Réinitialiser le bouton survolé
    this.boutonSurvole = null;

    // ===== SURVOL SUR LE MENU PRINCIPAL =====
    if (this.state === "PRINCIPAL") {
      // Vérifier chaque bouton du menu
      Object.values(this.boutons).forEach((bouton) => {
        if (this.isInside(x, y, bouton)) {
          this.boutonSurvole = bouton;
          this.canvas.style.cursor = "pointer"; // Curseur en forme de main
        }
      });
    }

    // ===== SURVOL SUR LA SÉLECTION DE PERSONNAGE =====
    else if (this.state === "SELECTION_PERSO") {
      // Positions des boutons RETOUR et JOUER
      const btnRetour = {
        x: this.canvas.width / 2 - 310,
        y: 500,
        width: 200,
        height: 50,
      };

      const btnJouer = {
        x: this.canvas.width / 2 + 110,
        y: 500,
        width: 200,
        height: 50,
      };

      // Survol du bouton RETOUR
      if (this.isInside(x, y, btnRetour)) {
        this.boutonSurvole = btnRetour;
        this.canvas.style.cursor = "pointer";
      } 
      // Survol du bouton JOUER (seulement si un personnage est choisi)
      else if (this.personnageChoisi && this.isInside(x, y, btnJouer)) {
        this.boutonSurvole = btnJouer;
        this.canvas.style.cursor = "pointer";
      }
    }

    // ===== CURSEUR PAR DÉFAUT =====
    // Si aucun bouton n'est survolé, remettre le curseur normal
    if (!this.boutonSurvole) {
      this.canvas.style.cursor = "default";
    }
  }
}