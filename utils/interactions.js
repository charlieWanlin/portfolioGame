// ==========================================
// GESTION DES INTERACTIONS AVEC LES OBJETS
// ==========================================
// Gère les interactions du joueur avec les objets et PNJ du jeu

import { overlayManager, inventory } from "./instances.js";
import { MESSAGES } from "./messages.js";
import { coffre } from "../classes/items/items.js";
import audioManager from "./audio.js";

// ==========================================
// AFFICHER LE MESSAGE D'INTERACTION
// ==========================================
/**
 * Dessine un rectangle avec le message "Appuyez sur A pour interagir"
 * au-dessus de l'écran lorsque le joueur est proche d'un objet
 * 
 * @param {CanvasRenderingContext2D} c - Contexte du canvas
 * @param {number} canvasWidth - Largeur du canvas
 * @param {string} objectName - Nom de l'objet à afficher
 */
export function drawInteractionMessage(c, canvasWidth, objectName) {
  // Dessiner le fond noir semi-transparent
  c.fillStyle = "rgba(0, 0, 0, 0.7)";
  c.fillRect(canvasWidth / 2 - 150, 50, 300, 60);

  // Dessiner la bordure blanche
  c.strokeStyle = "#ffffff";
  c.lineWidth = 2;
  c.strokeRect(canvasWidth / 2 - 150, 50, 300, 60);

  // Dessiner le texte d'instruction
  c.fillStyle = "#ffffff";
  c.font = "20px Arial";
  c.textAlign = "center";
  c.fillText(`Appuyez sur A pour interagir`, canvasWidth / 2, 75);
  c.fillText(`avec ${objectName}`, canvasWidth / 2, 95);
}

// ==========================================
// TROUVER L'OBJET PROCHE DU JOUEUR
// ==========================================
/**
 * Parcourt tous les objets du jeu et retourne celui qui est
 * à portée d'interaction du joueur
 * 
 * @param {Object} player - Objet joueur avec position
 * @param {Array} objects - Tableau de tous les objets interactifs
 * @returns {Object|null} - L'objet proche ou null si aucun
 */
export function findNearbyObject(player, objects) {
  for (let i = 0; i < objects.length; i++) {
    const obj = objects[i];

    // Ignorer les objets déjà collectés SAUF le coffre
    // (le coffre reste interactif même après collecte pour l'animation)
    if (obj.collected === true && obj.name !== "Coffre") {
      continue;
    }

    // Vérifier si l'objet est à portée du joueur
    if (obj.isNearPlayer(player)) {
      return obj;
    }
  }

  return null; // Aucun objet à proximité
}

// ==========================================
// GÉRER L'INTERACTION AVEC UN OBJET
// ==========================================
/**
 * Exécute la logique d'interaction selon le type d'objet
 * Gère les PNJ, objets collectables, et objets spéciaux (coffre)
 * 
 * @param {Object} nearbyObject - L'objet avec lequel interagir
 */
export function handleInteraction(nearbyObject) {
  // Vérification de sécurité : objet existe
  if (!nearbyObject) {
    return;
  }

  // Si un overlay est déjà ouvert, bloquer les interactions
  // (évite les doubles interactions)
  if (overlayManager.estOuvert()) {
    return;
  }

  // ===== INTERACTIONS AVEC LES PNJ =====

  // ===== LAPIN BLANC =====
  if (nearbyObject.name === "Lapin Blanc" || nearbyObject.type === "lapin") {
    overlayManager.afficherDialogue(
      MESSAGES.lapin.nom,
      MESSAGES.lapin.icone,
      MESSAGES.lapin.message,
      MESSAGES.lapin.image,
    );
    return;
  }

  // ===== VIEIL HOMME (avec choix de pilules) =====
  if (nearbyObject.name === "Vieil Homme" || nearbyObject.type === "oldman") {
    overlayManager.afficherDialogue(
      MESSAGES.oldman.nom,
      MESSAGES.oldman.icone,
      MESSAGES.oldman.message,
      MESSAGES.oldman.image,
      MESSAGES.oldman.choices, // Choix : pilule rouge ou bleue
    );
    return;
  }

  // ===== INTERACTIONS AVEC LES OBJETS COLLECTABLES =====

  // ===== CLÉ =====
  if (nearbyObject.name === "Clé" || nearbyObject.type === "cle") {
    // Vérifier si la clé n'a pas déjà été collectée
    if (!nearbyObject.collected) {
      // Marquer l'objet comme collecté
      nearbyObject.collect();
      // Ajouter à l'inventaire
      inventory.addItem("cle");
      // Jouer le son de collecte
      audioManager.playItemSound();
      
      // Attendre 1.5s (pour voir l'animation) puis afficher le message
      setTimeout(() => {
        overlayManager.afficherDialogueAvecContinuer(
          MESSAGES.cle.message,
          MESSAGES.cle // Passe l'objet complet (nom, icône, image)
        );
      }, 1500);
    }
    return;
  }

  // ===== PARCHEMIN (Lettre de motivation) =====
  if (nearbyObject.name === "Parchemin" || nearbyObject.type === "parchemin") {
    // Vérifier si le parchemin n'a pas déjà été collecté
    if (!nearbyObject.collected) {
      // Marquer l'objet comme collecté
      nearbyObject.collect();
      // Ajouter à l'inventaire
      inventory.addItem("parchemin");
      // Jouer le son de collecte
      audioManager.playItemSound();
      
      // Attendre 1.5s puis afficher le dialogue avec 2 boutons
      setTimeout(() => {
        overlayManager.afficherDialogueAvecContinuer(
          MESSAGES.parchemin.message,
          MESSAGES.parchemin // Passe l'objet complet
        );
      }, 1500);
    }
    return;
  }

  // ===== COFFRE MAGIQUE =====
  if (nearbyObject.name === "Coffre" || nearbyObject.type === "coffre") {
    // Vérifier si le joueur possède la clé
    if (inventory.hasItem("cle")) {
      // Le joueur a la clé : ouvrir le coffre
      if (!nearbyObject.isOpened) {
        // Ouvrir le coffre (animation)
        nearbyObject.open();
        // Ajouter le coffre à l'inventaire
        inventory.addItem("coffre");
        // Jouer la musique de fin
        audioManager.playEndMusic();
        // Jouer le son de collecte d'item
        audioManager.playItemSound();

        // Attendre 1.5s pour voir l'animation d'ouverture
        setTimeout(() => {
          overlayManager.afficherDialogueAvecContinuer(
            MESSAGES.coffre.avecCle, // Message "Coffre ouvert"
            MESSAGES.coffre // Passe l'objet complet avec image
          );
        }, 1500);
      }
    } else {
      // Le joueur n'a pas la clé : afficher message de coffre verrouillé
      overlayManager.afficherDialogueAvecContinuer(
        MESSAGES.coffre.sansCle, // Message "Coffre verrouillé"
        MESSAGES.coffre // Passe l'objet complet avec image
      );
    }
    return;
  }

  // ===== OBJETS GÉNÉRIQUES =====
  // Pour tout autre objet collectable non spécifié ci-dessus
  if (nearbyObject.collected !== undefined && !nearbyObject.collected) {
    nearbyObject.collect();
  }
}