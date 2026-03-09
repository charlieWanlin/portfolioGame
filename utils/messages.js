// ==========================================
// MESSAGES DES OBJETS ET PNJ
// ==========================================
// Centralise tous les dialogues, descriptions et textes du jeu
// Facilite la modification et la traduction éventuelle

export const MESSAGES = {
  // ===== OBJETS COLLECTABLES ET INTERACTIFS =====

  // ===== COFFRE MAGIQUE =====
  // Objet final du jeu, contient deux états : verrouillé ou ouvert
  coffre: {
    nom: "Coffre magique",
    icone: "📦", // Emoji de secours si l'image ne charge pas
    image: "./img/coffre.png", // Image PNG du coffre
    
    // Message affiché quand le joueur ouvre le coffre avec la clé
    // Déclenche la fin du jeu et le rideau de recrutement
    avecCle: `<span class="emphasis-gold">🎉 FÉLICITATIONS ! 🎉</span><br><br>
Tu as trouvé ton stagiaire : prêt à affronter tous les bugs, explorer chaque ligne de code, et protéger ton royaume lors des sessions de review.`,
    
    // Message affiché quand le joueur essaie d'ouvrir le coffre sans la clé
    // Encourage l'exploration pour trouver la clé
    sansCle: `
      <span class="emphasis">🔒 Coffre verrouillé</span><br><br>
      Il te faut une <span class="emphasis-gold">clé</span> pour ouvrir ce coffre...<br><br>
      Continue d'explorer pour la trouver !
    `,
  },

  // ===== CLÉ MYSTÉRIEUSE =====
  // Objet nécessaire pour ouvrir le coffre magique
  cle: {
    nom: "Clé mystérieuse",
    icone: "🔑",
    image: "./img/key.png",
    
    // Message affiché lors de la collecte de la clé
    message: `
      <span class="emphasis-gold">Bravo, tu as trouvé une clé !</span><br><br>
      Elle doit servir à quelque chose...
    `,
  },

  // ===== PARCHEMIN (Lettre de motivation) =====
  // Objet spécial qui ouvre un PDF externe
  parchemin: {
    nom: "Lettre de motivation",
    icone: "📜",
    image: "./img/parchemin.png",
    
    // Message affiché lors de la collecte du parchemin
    // Propose 2 boutons : lire le PDF (B) ou continuer (A)
    message: `
      <span class="emphasis"> Lettre de motivation trouvée !</span><br><br>
      Tu as trouvé ma lettre de motivation !
    `,
  },

  // ===== PERSONNAGES NON-JOUEURS (PNJ) =====

  // ===== LAPIN BLANC =====
  // Premier PNJ rencontré, donne un indice sur l'esprit du jeu
  lapin: {
    nom: "Le Lapin Blanc",
    icone: "🐰",
    image: "./img/whiteRabbitIcon.png",
    
    // Dialogue du lapin : encourage la curiosité et l'exploration
    message: `
      Pour découvrir ce jeu, il te faudra la <span class="emphasis-gold">curiosité</span> d'un vrai développeur.
    `,
  },

  // ===== VIEUX SAGE =====
  // PNJ principal avec un choix décisif (pilule rouge ou bleue, référence Matrix)
  oldman: {
    nom: "Le Vieux Sage",
    icone: "👴",
    image: "./img/oldman-icon.png",
    
    // Dialogue du vieux sage : présente le choix des pilules
    message: `
      Je peux te proposer deux choix…
      Le choix t'appartient, <span class="emphasis">recruteur</span>...
    `,
    
    // Indique que ce PNJ propose des choix multiples
    hasChoices: true,
    
    // ===== CHOIX DES PILULES (référence Matrix) =====
    choices: [
      {
        key: "A", // Touche A de la Gameboy
        label: "Pilule bleue (Restez dans la matrice)", // Choix "safe"
        action: "continue", // Ferme simplement le dialogue
      },
      {
        key: "B", // Touche B de la Gameboy
        label: "Pilule rouge (La vraie vie)", // Choix "aventure"
        action: "curtain", // Déclenche le rideau de fin + musique
      },
    ],
  },
};