// ==========================================
// GESTION DES OVERLAYS
// ==========================================
// Gère l'affichage des fenêtres popup pour les objets et dialogues

class OverlayManager {
  constructor() {
    // ===== OVERLAY SIMPLE (pour les objets) =====
    this.simpleOverlay = document.getElementById("simple-overlay");
    this.simpleMessage = document.getElementById("simple-message");
    this.simpleBtn = document.getElementById("simple-close-btn");
    this.btnLireLettre = document.getElementById("readMotivationLetter");

    // ===== OVERLAY DIALOGUE (pour les personnages/PNJ) =====
    this.dialogueOverlay = document.getElementById("dialogue-overlay");
    this.dialogueName = document.getElementById("dialogue-name");
    this.dialogueIcon = document.getElementById("dialogue-icon");
    this.dialogueMessage = document.getElementById("dialogue-message");
    this.dialogueBtn = document.getElementById("dialogue-close-btn");
    this.dialogueFooter = this.dialogueBtn.parentElement;

    // ===== BOUTON A DE LA GAMEBOY =====
    this.boutonA = document.querySelector('[data-bouton="a"]');

    // ===== ÉTAT DE L'OVERLAY =====
    this.isOverlayOpen = false; // L'overlay est-il actuellement affiché ?
    this.currentChoices = null; // Les choix disponibles (pilules, coffre, etc.)
    this.currentObject = null; // L'objet actuellement affiché

    // Initialiser les événements
    this.initEvents();
  }

  // ========================================
  // INITIALISER LES ÉVÉNEMENTS
  // ========================================
  /**
   * Configure tous les événements de clic/touch pour les boutons d'overlay
   */
  initEvents() {
    // ===== BOUTON FERMER OVERLAY SIMPLE =====
    this.simpleBtn.addEventListener("click", () => this.fermerSimple());
    this.simpleBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.fermerSimple();
    });

    // ===== BOUTON LIRE LA LETTRE (dans overlay simple) =====
    if (this.btnLireLettre) {
      this.btnLireLettre.addEventListener("click", () => {
        window.open("files/lettreMotivationCW.pdf", "_blank");
      });
      this.btnLireLettre.addEventListener("touchstart", (e) => {
        e.preventDefault();
        window.open("files/lettreMotivationCW.pdf", "_blank");
      });
    }

    // ===== BOUTON FERMER OVERLAY DIALOGUE =====
    this.dialogueBtn.addEventListener("click", () => this.fermerDialogue());
    this.dialogueBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.fermerDialogue();
    });

    // ===== BOUTON A DE LA GAMEBOY (fermeture rapide) =====
    if (this.boutonA) {
      this.boutonA.addEventListener("click", () => {
        // Ferme l'overlay uniquement s'il n'y a pas de choix multiples
        if (this.isOverlayOpen && !this.currentChoices) {
          this.fermerTous();
        }
      });

      this.boutonA.addEventListener("touchstart", (e) => {
        if (this.isOverlayOpen && !this.currentChoices) {
          e.preventDefault();
          this.fermerTous();
        }
      });
    }
  }

  // ========================================
  // AFFICHER OVERLAY SIMPLE (OBJETS)
  // ========================================
  /**
   * Affiche un message simple pour un objet collecté/interactif
   * @param {string} message - Message à afficher
   * @param {string|null} objet - Nom de l'objet (pour logique spéciale)
   */
  afficherSimple(message, objet = null) {
    this.simpleMessage.innerHTML = message;
    this.currentObject = objet;

    // Afficher/masquer le bouton "Lire la lettre" selon l'objet
    if (this.btnLireLettre) {
      if (objet === "parchemin") {
        this.btnLireLettre.classList.remove("hidden");
      } else {
        this.btnLireLettre.classList.add("hidden");
      }
    }

    this.simpleOverlay.classList.remove("hidden");
    this.isOverlayOpen = true;
  }

  /**
   * Ferme l'overlay simple et réinitialise son contenu
   */
  fermerSimple() {
    this.simpleOverlay.classList.add("hidden");
    this.isOverlayOpen = false;
    this.currentObject = null;
    this.simpleMessage.innerHTML = "";

    // Cacher le bouton "Lire la lettre"
    if (this.btnLireLettre) {
      this.btnLireLettre.classList.add("hidden");
    }
  }

  // ========================================
  // AFFICHER OVERLAY DIALOGUE (PNJ)
  // ========================================
  /**
   * Affiche un dialogue avec un personnage
   * @param {string} nom - Nom du personnage
   * @param {string} icone - Emoji ou HTML de l'icône
   * @param {string} message - Message du dialogue
   * @param {string|null} image - Chemin de l'image PNG (optionnel)
   * @param {Array|null} choices - Tableau de choix (pilules, etc.)
   */
  afficherDialogue(nom, icone, message, image = null, choices = null) {
    this.dialogueName.textContent = nom;

    // Gérer l'icône : image PNG ou emoji
    if (image) {
      this.dialogueIcon.innerHTML = `<img src="${image}" alt="${nom}" class="dialogue-icon-img">`;
    } else {
      this.dialogueIcon.innerHTML = icone;
    }

    this.dialogueMessage.innerHTML = message;

    // Gérer les choix multiples (pilules, etc.)
    if (choices && choices.length > 0) {
      this.currentChoices = choices;
      this.afficherChoix(choices);
    } else {
      this.currentChoices = null;
      this.afficherBoutonFermer();
    }

    this.dialogueOverlay.classList.remove("hidden");
    this.isOverlayOpen = true;
  }

  // ========================================
  // MÉTHODE POUR OBJETS (clé, parchemin, coffre)
  // ========================================
  /**
   * Affiche un dialogue spécifique selon l'objet interagi
   * Gère la logique spéciale pour le parchemin et le coffre
   * @param {string} message - Message à afficher
   * @param {Object|null} objetData - Données de l'objet (nom, icône, image)
   */
  afficherDialogueAvecContinuer(message, objetData = null) {
    const nom = objetData?.nom || "Message";
    const icone = objetData?.icone || "📦";
    const image = objetData?.image || null;

    // ===== CAS 1 : PARCHEMIN / LETTRE DE MOTIVATION =====
    // Affiche 2 boutons : "Lire la lettre" (B) et "Continuer" (A)
    if (nom === "Lettre de motivation" || nom === "Parchemin ancien") {
      this.afficherDialogueParchemin(nom, icone, message, image);
      return;
    }

    // ===== CAS 2 : COFFRE MAGIQUE =====
    // Vérifier si le coffre est verrouillé ou ouvert
    if (nom === "Coffre magique") {
      const estVerrouille =
        message.includes("verrouillé") || message.includes("fermé");

      if (estVerrouille) {
        // Coffre verrouillé : bouton standard "Appuyez sur (A) pour continuer"
        this.afficherDialogue(nom, icone, message, image, null);
      } else {
        // Coffre ouvert : bouton spécial "Appuyez sur (A) pour me recruter"
        this.afficherDialogueCoffreOuvert(nom, icone, message, image);
      }
      return;
    }

    // ===== CAS 3 : CLÉ OU AUTRE OBJET =====
    // Bouton standard "Appuyez sur (A) pour continuer"
    this.afficherDialogue(nom, icone, message, image, null);
  }

  // ========================================
  // AFFICHER DIALOGUE POUR LE PARCHEMIN (2 boutons)
  // ========================================
  /**
   * Affiche le dialogue du parchemin avec 2 boutons
   * Bouton B : Ouvrir le PDF de la lettre de motivation
   * Bouton A : Continuer
   */
  afficherDialogueParchemin(nom, icone, message, image) {
    this.dialogueName.textContent = nom;

    if (image) {
      this.dialogueIcon.innerHTML = `<img src="${image}" alt="${nom}" class="dialogue-icon-img">`;
    } else {
      this.dialogueIcon.innerHTML = icone;
    }

    this.dialogueMessage.innerHTML = message;

    // Définir les choix pour que controls.js puisse les gérer
    this.currentChoices = [
      { key: "B", label: "Lire la lettre", action: "open-pdf" },
      { key: "A", label: "Continuer", action: "continue" },
    ];

    // Créer les 2 boutons avec le format standard
    this.dialogueFooter.innerHTML = `
      <button class="dialogue-btn" id="btn-lire-lettre">
        <span class="btn-key">Appuyez sur (B) </span> pour lire ma lettre
      </button>
      <button class="dialogue-btn" id="btn-continuer-parchemin">
        <span class="btn-key">Appuyez sur (A) </span> pour continuer
      </button>
    `;

    this.dialogueOverlay.classList.remove("hidden");
    this.isOverlayOpen = true;

    // Attacher les événements APRÈS l'affichage (setTimeout pour éviter les bugs)
    setTimeout(() => {
      // ===== ÉVÉNEMENT BOUTON B : LIRE LA LETTRE =====
      const btnLireLettre = document.getElementById("btn-lire-lettre");

      if (btnLireLettre) {
        btnLireLettre.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.handleChoice("open-pdf");
        });

        btnLireLettre.addEventListener("touchstart", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.handleChoice("open-pdf");
        });
      }

      // ===== ÉVÉNEMENT BOUTON A : CONTINUER =====
      const btnContinuer = document.getElementById("btn-continuer-parchemin");

      if (btnContinuer) {
        btnContinuer.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.handleChoice("continue");
        });

        btnContinuer.addEventListener("touchstart", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.handleChoice("continue");
        });
      }
    }, 100);
  }

  // ========================================
  // AFFICHER DIALOGUE POUR LE COFFRE OUVERT
  // ========================================
  /**
   * Affiche le dialogue du coffre ouvert
   * Bouton A : Me recruter (déclenche le rideau de fin)
   */
  afficherDialogueCoffreOuvert(nom, icone, message, image) {
    this.dialogueName.textContent = nom;

    if (image) {
      this.dialogueIcon.innerHTML = `<img src="${image}" alt="${nom}" class="dialogue-icon-img">`;
    } else {
      this.dialogueIcon.innerHTML = icone;
    }

    this.dialogueMessage.innerHTML = message;

    // Définir le choix pour que controls.js puisse le gérer
    this.currentChoices = [
      { key: "A", label: "Me recruter", action: "curtain-end" },
    ];

    // Créer le bouton spécial "pour me recruter"
    this.dialogueFooter.innerHTML = `
      <button class="dialogue-btn" id="btn-recruter-coffre">
        <span class="btn-key">Appuyez sur (A) </span> pour me recruter
      </button>
    `;

    this.dialogueOverlay.classList.remove("hidden");
    this.isOverlayOpen = true;

    // Attacher l'événement APRÈS l'affichage
    setTimeout(() => {
      const btnRecruterCoffre = document.getElementById("btn-recruter-coffre");

      if (btnRecruterCoffre) {
        btnRecruterCoffre.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.handleChoice("curtain-end");
        });

        btnRecruterCoffre.addEventListener("touchstart", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.handleChoice("curtain-end");
        });
      }
    }, 100);
  }

  // ========================================
  // AFFICHER LES BOUTONS DE CHOIX
  // ========================================
  /**
   * Crée dynamiquement les boutons de choix (pilules, etc.)
   * @param {Array} choices - Tableau d'objets {key, label, action}
   */
  afficherChoix(choices) {
    // Vider le footer pour reconstruire les boutons
    this.dialogueFooter.innerHTML = "";

    // Créer un bouton pour chaque choix
    choices.forEach((choice) => {
      const btn = document.createElement("button");
      btn.className = "dialogue-btn btn-choice";

      // Ajouter des classes CSS spéciales pour les pilules
      if (choice.label.includes("🔴") || choice.label.includes("rouge")) {
        btn.classList.add("pilule-rouge");
      }
      if (choice.label.includes("🔵") || choice.label.includes("bleue")) {
        btn.classList.add("pilule-bleue");
      }

      btn.innerHTML = `<span class="btn-key">${choice.key}</span> ${choice.label}`;

      // Attacher les événements click et touch
      btn.addEventListener("click", (e) => {
        e.stopPropagation(); // Empêcher la propagation pour éviter les doubles clics
        this.handleChoice(choice.action);
      });
      btn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleChoice(choice.action);
      });

      this.dialogueFooter.appendChild(btn);
    });
  }

  // ========================================
  // AFFICHER LE BOUTON DE FERMETURE NORMAL
  // ========================================
  /**
   * Affiche le bouton standard "Appuyez sur (A) pour continuer"
   */
  afficherBoutonFermer() {
    this.dialogueFooter.innerHTML = `
      <button class="dialogue-btn" id="dialogue-close-btn">
        <span class="btn-key">Appuyez sur (A) </span> pour continuer
      </button>
    `;

    // Réattacher l'événement au nouveau bouton
    this.dialogueBtn = document.getElementById("dialogue-close-btn");
    this.dialogueBtn.addEventListener("click", () => this.fermerDialogue());
    this.dialogueBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.fermerDialogue();
    });
  }

  // ========================================
  // GÉRER UN CHOIX
  // ========================================
  /**
   * Exécute l'action associée à un choix
   * @param {string} action - Action à exécuter ("continue", "curtain", "open-pdf", etc.)
   */
  handleChoice(action) {
    if (action === "continue") {
      // Fermer simplement le dialogue
      this.fermerDialogue();
    } else if (action === "curtain") {
      // Pilule rouge : fermer puis afficher le rideau de fin
      this.fermerDialogue();
      this.afficherRideau();
    } else if (action === "curtain-end") {
      // Coffre ouvert : fermer puis afficher le rideau de fin
      this.fermerDialogue();
      this.afficherRideau();
    } else if (action === "open-pdf") {
      // Ouvrir le PDF de la lettre de motivation
      const pdfPath = "files/lettreMotivationCW.pdf";
      const pdfWindow = window.open(pdfPath, "_blank");

      // Vérifier si la popup a été bloquée par le navigateur
      if (
        !pdfWindow ||
        pdfWindow.closed ||
        typeof pdfWindow.closed === "undefined"
      ) {
        // Si bloquée, utiliser une approche alternative (création de lien)
        const link = document.createElement("a");
        link.href = pdfPath;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // NE PAS fermer l'overlay : l'utilisateur peut continuer à lire le dialogue
    }
  }

  // ========================================
  // AFFICHER LE RIDEAU DE FIN
  // ========================================
  /**
   * Affiche l'écran de fin avec le message et les boutons (CV, contact, rejouer)
   */
  afficherRideau() {
    const curtain = document.createElement("div");
    curtain.className = "curtain";
    curtain.innerHTML = `
      <div class="curtain-content">
        <!-- Message de fin avec coeur -->
        <p>
          Merci d'avoir joué !
          <span class="heart">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="red"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                       4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 
                       14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
                       6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </span>
        </p>

        <!-- Boutons de fin -->
        <div class="endButtons">
          <a href="index.html" class="btn">Rejouer</a>
          <button class="openCVButton btn">Mon CV</button>
          <a href="tel:+33749542696" class="btn">Appelez-moi</a>
          <a href="mailto:charliewanlin.pro@gmail.com" class="btn">Me contacter</a>
        </div>
      </div>
    `;

    document.body.appendChild(curtain);

    // Attacher l'événement pour ouvrir le CV
    const cvButton = curtain.querySelector(".openCVButton");
    if (cvButton) {
      cvButton.addEventListener("click", () => {
        window.open("./files/monCV.pdf", "_blank");
      });
    }
  }

  /**
   * Ferme le dialogue et réinitialise son contenu
   */
  fermerDialogue() {
    this.dialogueOverlay.classList.add("hidden");
    this.isOverlayOpen = false;
    this.currentChoices = null;
    this.dialogueName.textContent = "";
    this.dialogueIcon.innerHTML = "";
    this.dialogueMessage.innerHTML = "";
  }

  // ========================================
  // FERMER TOUS LES OVERLAYS
  // ========================================
  /**
   * Ferme tous les overlays et réinitialise leur état
   */
  fermerTous() {
    this.simpleOverlay.classList.add("hidden");
    this.dialogueOverlay.classList.add("hidden");
    this.isOverlayOpen = false;
    this.currentChoices = null;
    this.currentObject = null;

    // Cacher le bouton "Lire la lettre"
    if (this.btnLireLettre) {
      this.btnLireLettre.classList.add("hidden");
    }
  }

  // ========================================
  // VÉRIFIER SI OVERLAY EST OUVERT
  // ========================================
  /**
   * Retourne true si un overlay est actuellement affiché
   * @returns {boolean}
   */
  estOuvert() {
    return this.isOverlayOpen;
  }
}

// ========================================
// EXPORT
// ========================================
export default OverlayManager;