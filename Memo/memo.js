/*
==========================================
MÉMO JAVASCRIPT - VERSION COURTE
==========================================

🖼️ CANVAS & CONTEXTE
--------------------
canvas = La toile (zone de dessin HTML)
c = Le pinceau (outil pour dessiner)

const canvas = document.getElementById("canvasJeu");
const c = canvas.getContext("2d");

⚠️ On dessine TOUJOURS avec 'c', JAMAIS avec 'canvas'

DESSINER :
  c.fillStyle = "red";                    // Couleur
  c.fillRect(x, y, largeur, hauteur);     // Rectangle plein
  c.strokeRect(x, y, largeur, hauteur);   // Rectangle vide (contour)
  c.fillText("texte", x, y);              // Texte
  c.drawImage(image, x, y);               // Image
  c.font = "30px Arial";                  // Police
  c.textAlign = "center";                 // Alignement


📦 CLASSES & OBJETS
-------------------
CLASSE = Moule/Plan pour créer des objets

class Voiture {
  constructor(marque, couleur) {    // ← Exécuté lors de la création
    this.marque = marque;           // ← 'this' = "cet objet-ci"
    this.couleur = couleur;
    this.vitesse = 0;
  }
  
  rouler() {                        // ← Méthode (action)
    this.vitesse = 50;
    console.log("Vroum !");
  }
}

CRÉER DES OBJETS :
  const v1 = new Voiture("Toyota", "rouge");    // ← 'new' crée l'objet
  const v2 = new Voiture("BMW", "bleue");
  
  v1.rouler();    // Appelle la méthode

RÉSUMÉ :
  class       = Moule
  new         = Créer un objet
  constructor = Initialisation
  this        = "Cet objet-ci"
  méthode     = Action de l'objet


📚 MODULES (IMPORT/EXPORT)
---------------------------
Séparer le code dans plusieurs fichiers

EXPORT (partager du code) :
  // sprite.js
  export class Sprite { ... }
  export const VITESSE = 4;

IMPORT (utiliser du code) :
  // main.js
  import { Sprite, VITESSE } from './sprite.js';
  //       ↑                       ↑
  //       Accolades obligatoires  Extension .js obligatoire

RÈGLES :
  ✅ Ajouter type="module" dans le HTML : <script type="module" src="main.js">
  ✅ Inclure l'extension .js dans les imports
  ✅ Utiliser un serveur local (pas double-clic)


🎯 EXEMPLE COMPLET
------------------

// classes/sprite.js
export class Sprite {
  constructor({ position, image }) {
    this.position = position;
    this.image = image;
  }
  
  draw(c) {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

// main.js
import { Sprite } from './classes/sprite.js';

const canvas = document.getElementById("canvasJeu");
const c = canvas.getContext("2d");

const player = new Sprite({
  position: { x: 100, y: 100 },
  image: playerImage
});

player.draw(c);    // Dessine le joueur


⚠️ PIÈGES À ÉVITER
------------------
❌ canvas.fillRect(...)          → ✅ c.fillRect(...)
❌ const p = Sprite(...)         → ✅ const p = new Sprite(...)
❌ nom = nom;                    → ✅ this.nom = nom;
❌ import Sprite from './...'    → ✅ import { Sprite } from './...'
❌ import './sprite'             → ✅ import './sprite.js'


📊 TABLEAUX RÉCAP
-----------------

CANVAS :
  canvas      = La toile
  c           = Le pinceau
  c.fillRect  = Rectangle plein
  c.fillText  = Texte
  c.drawImage = Image

CLASSES :
  class       = Moule
  new         = Créer objet
  constructor = Initialisation
  this        = "Cet objet-ci"
  méthode     = Action

MODULES :
  export      = Partager code
  import      = Utiliser code
  { ... }     = Accolades pour exports nommés
  .js         = Extension obligatoire

==========================================




Permet d'arrond au plus bas un nombre decimal , ce qui est parfait pour les indices de tableau ou les positions en pixel.
// Math.floor(4.9)   // Résultat: 4
// Math.floor(4.1)   // Résultat: 4
// Math.floor(4.0)   // Résultat: 4
// Math.floor(7.8)   // Résultat: 7
// Math.floor(-2.3)  // Résultat: -3 
*/

// Les états ("PRINCIPAL", "JEU", etc.) sont de simples chaînes de caractères.
// Le code fonctionne car on compare toujours EXACTEMENT la même valeur.
// Les majuscules sont une convention pour les états fixes (lisibilité).

// gameState gère l'état global du jeu (MENU ou PLAYING)
// menu.state gère la page affichée à l'intérieur du menu

// Les classes utilisent la convention PascalCase (Menu, Sprite, Boundary)
// Les variables et fonctions utilisent camelCase (gameState, drawMenu)

// JavaScript est sensible à la casse :
// "PRINCIPAL" !== "principal"

// reset() permet de remettre le menu dans son état initial
// ici : écran d'accueil (menu principal)




//=========================================================
// EXPLICATION SUR L'ANIMATION DU LAPIN
//=========================================================

// # MÉMO : SYSTÈME D'ANIMATION DES NPC 🎮

// ## 🎯 VUE D'ENSEMBLE

// Il y a 2 systèmes qui fonctionnent EN MÊME TEMPS :
// 1. **animate()** = fait bouger les poses du sprite (bras, jambes)
// 2. **move()** = fait bouger le personnage sur la carte

// Ils sont INDÉPENDANTS mais synchronisés !

// ---

// ## 📊 LES COMPTEURS ET LEUR RÔLE

// ### frameCounter (dans animate())
// - **Rôle** : Compte les frames du jeu pour savoir QUAND changer de pose
// - **Réinitialisation** : JAMAIS (compte en continu)
// - **Utilité** : Contrôler la vitesse d'animation des poses

// ### moveCounter (dans move())
// - **Rôle** : Compte les frames du jeu pour savoir QUAND se déplacer
// - **Réinitialisation** : À chaque mouvement (remis à 0)
// - **Utilité** : Créer des pauses entre les déplacements

// ### frames.val
// - **Rôle** : Quelle pose du sprite on affiche actuellement (0, 1, 2, ou 3)
// - **Valeurs** : 0 → 1 → 2 → 3 → 0 (boucle)
// - **Réinitialisation** : Quand on change de direction (pour recommencer l'animation proprement)

// ### patternIndex
// - **Rôle** : Où on en est dans le pattern de mouvement
// - **Valeurs** : 0 → 1 → 2 → ... → longueur du pattern → 0 (boucle)
// - **Exemple** : Si pattern = ["down", "down", "right"], patternIndex va de 0 à 2

// ---

// ## 🎬 animate() - L'ANIMATION DES POSES
// ```javascript





// Les fonctions , je peux faire function openCoffre() quand il y a rien , je peux faire la function fléchée quand il y a une intéraction , par exemple , document.addEventlistener("click", =>)
// et il ya la fucntion dans une classe ce que j'ai beaucoup fais pour faire ce projet , on ne mets pas function avant on mets appelle jsute la function qu'on veut 
// par exemple. openCOffre() {
// }

// for (let i = 0; i < objects.length; i++) {
//     const obj = objects[i];
    
//     // ===== Ignorer les objets collectés =====
//     if (obj.collected === true) {
//       continue;
//     }
//     // ========================================
    
//     // Calculer les dimensions réelles (avec scale si applicable)
//     const objWidth = obj.width * (obj.scale || 1);
//     const objHeight = obj.height * (obj.scale || 1);
    
//     if (rectangularCollision({
//       rectangle1: futurePlayer,
//       rectangle2: {
//         position: obj.position,
//         width: objWidth,
//         height: objHeight
//       }
//     })) {
//       return true; // Collision détectée
//     }
//   }