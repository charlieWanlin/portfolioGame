// ==========================================
// IMPORTS DES MODULES
// ==========================================
import { Sprite } from "./classes/sprites.js";
import { Boundary } from "./classes/boundary.js";
import { Menu } from "./classes/menu.js";
import Inventory from "./utils/inventory.js";
import {
  rectangularCollision,
  checkObjectCollision,
} from "./utils/collision.js";
import { CONFIG } from "./utils/config.js";
import { collisions } from "./data/collisions.js";
import { initMovements } from "./utils/movements.js";
import { overlayManager } from "./utils/instances.js";
import { allItems } from "./classes/items/items.js";
import { allNPCs } from "./classes/npc.js";
import { NPCS_POSITIONS } from "./data/npcsData.js";
import { ITEMS_POSITIONS } from "./data/itemsData.js";
import {
  drawInteractionMessage,
  findNearbyObject,
  handleInteraction,
} from "./utils/interactions.js";
import {
  initKeyboardControls,
  updateGameContext,
  keys,
} from "./utils/controls.js";
import audioManager from "./utils/audio.js";
import {
  toggleBurgerMenu,
  toggleHealthDisplay,
  initUI,
  demarrageButton,
} from "./utils/ui.js";
import { resetToMenu } from "./utils/gameReset.js";
import { initLightboxGallery } from "./utils/making-of.js";
import "./utils/power.js";

// ==========================================
// INITIALISATION DU CANVAS
// ==========================================
const canvas = document.getElementById("canvasJeu");
const c = canvas.getContext("2d");
const menu = new Menu(canvas, c);

canvas.width = CONFIG.CANVAS_WIDTH;
canvas.height = CONFIG.CANVAS_HEIGHT;

// ==========================================
// ÉTATS DU JEU
// ==========================================
let gameState = "MENU";
let personnageChoisi = null;

// ==========================================
// CRÉATION DE L'INVENTAIRE
// ==========================================
const inventory = new Inventory();

// ==========================================
// INITIALISATION DE L'INTERFACE UTILISATEUR
// ==========================================
initUI();

// ==========================================
// INITIALISATON DU MAKING OF
// ==========================================

// Initialiser la lightbox au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
  initLightboxGallery();
});

// ==========================================
// CONFIGURATION DE LA MAP
// ==========================================
const offset = { ...CONFIG.OFFSET };

// Convertir le tableau de collisions en matrice 2D
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += CONFIG.COLLISION_MAP_WIDTH) {
  collisionsMap.push(collisions.slice(i, i + CONFIG.COLLISION_MAP_WIDTH));
}

// ==========================================
// CRÉATION DES OBSTACLES (BOUNDARIES)
// ==========================================
const boundaries = [];

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        }),
      );
    }
  });
});

// ==========================================
// CHARGEMENT DES IMAGES - MAP
// ==========================================
const image = new Image();
image.src = "./img/pelletTown.png";

const foregroundImage = new Image();
foregroundImage.src = "./img/foreground.png";

// ==========================================
// CHARGEMENT DES IMAGES - PERSONNAGE FÉMININ
// ==========================================
const playerDownImage = new Image();
playerDownImage.src = "./img/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "./img/playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./img/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "./img/playerRight.png";

// ==========================================
// CHARGEMENT DES IMAGES - PERSONNAGE MASCULIN
// ==========================================
const player2DownImage = new Image();
player2DownImage.src = "./img/player2Down.png";

const player2UpImage = new Image();
player2UpImage.src = "./img/player2Up.png";

const player2LeftImage = new Image();
player2LeftImage.src = "./img/player2Left.png";

const player2RightImage = new Image();
player2RightImage.src = "./img/player2Right.png";

// ==========================================
// CRÉATION DU BACKGROUND (FOND DE LA MAP)
// ==========================================
const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

// ==========================================
// CRÉATION DU FOREGROUND (PREMIER PLAN)
// ==========================================
const foreground = new Sprite({
  position: {
    x: offset.x + 432,
    y: offset.y + 147,
  },
  image: foregroundImage,
});

// ==========================================
// COMBINE OBJETS ET PNJ
// ==========================================
const allInteractiveObjects = [...allItems, ...allNPCs];
let nearbyObject = null;

// ==========================================
// CRÉATION DU JOUEUR
// ==========================================
let player = null;

// ==========================================
// ÉLÉMENTS QUI BOUGENT AVEC LE JOUEUR
// ==========================================
const movables = [
  background,
  ...boundaries,
  foreground,
  ...allInteractiveObjects,
];

// ==========================================
// INITIALISER LES CONTRÔLES CLAVIER
// ==========================================
initKeyboardControls();

// ==========================================
// ÉVÉNEMENT : RETOUR AU MENU
// ==========================================
demarrageButton.addEventListener("click", () => {
  const reset = resetToMenu(
    menu,
    keys,
    background,
    foreground,
    boundaries,
    collisionsMap,
    offset,
    inventory,
  );
  gameState = reset.gameState;
  personnageChoisi = reset.personnageChoisi;
  player = reset.player;
});

// ======================================
// L'EXPORT JUSTE POUR LE RESET DU BOUTON POWER
// ======================================
export function resetGameFromPower() {
  const reset = resetToMenu(
    menu,
    keys,
    background,
    foreground,
    boundaries,
    collisionsMap,
    offset,
    inventory
  );
  gameState = reset.gameState;
  personnageChoisi = reset.personnageChoisi;
  player = reset.player;
}

// ==========================================
// BOUCLE PRINCIPALE DU JEU (ANIMATION)
// ==========================================
function animate() {
  window.requestAnimationFrame(animate);

  if (gameState === "MENU") {
    menu.draw();
  } else if (gameState === "PLAYING") {
    // Rendu de la map et des éléments
    background.draw(c);
    boundaries.forEach((boundary) => boundary.draw(c));

    // Rendu des objets et PNJ
    for (let i = 0; i < allInteractiveObjects.length; i++) {
      allInteractiveObjects[i].draw(c);
    }

    // Rendu du joueur et du foreground
    if (player) player.draw(c);
    foreground.draw(c);

    if (!player) return;

    // Détection d'objet proche pour interaction
    nearbyObject = findNearbyObject(player, allInteractiveObjects);

    // Mise à jour du contexte pour les contrôles
    updateGameContext(gameState, nearbyObject);

    // Afficher le message d'interaction si objet proche
    if (nearbyObject !== null) {
      drawInteractionMessage(c, canvas.width, nearbyObject.name);
    }

    // ==========================================
    // GESTION DES DÉPLACEMENTS AVEC COLLISIONS
    // ==========================================
    let moving = true;
    player.moving = false;

    // ==========================================
    // DÉPLACEMENT HAUT (touche Z)
    // ==========================================
    if (keys.z.pressed) {
      player.moving = true;
      player.image = player.sprites.up;
      moving = true;

      // Vérifier collision avec les boundaries (murs, arbres, obstacles)
      for (let boundary of boundaries) {
        if (
          rectangularCollision({
            rectangle1: {
              ...player,
              position: {
                x: player.position.x,
                y: player.position.y - CONFIG.SPEED,
              },
            },
            rectangle2: boundary,
          })
        ) {
          moving = false;
          break;
        }
      }

      // Vérifier collision avec les NPCs et objets
      if (
        moving &&
        checkObjectCollision(player, allInteractiveObjects, "up", CONFIG.SPEED)
      ) {
        moving = false;
      }

      // Déplacer tous les éléments si aucune collision
      if (moving) {
        movables.forEach((movable) => {
          movable.position.y += CONFIG.SPEED;
        });
      }
    }

    // ==========================================
    // DÉPLACEMENT BAS (touche S)
    // ==========================================
    else if (keys.s.pressed) {
      player.moving = true;
      player.image = player.sprites.down;
      moving = true;

      for (let boundary of boundaries) {
        if (
          rectangularCollision({
            rectangle1: {
              ...player,
              position: {
                x: player.position.x,
                y: player.position.y + CONFIG.SPEED,
              },
            },
            rectangle2: boundary,
          })
        ) {
          moving = false;
          break;
        }
      }

      if (
        moving &&
        checkObjectCollision(
          player,
          allInteractiveObjects,
          "down",
          CONFIG.SPEED,
        )
      ) {
        moving = false;
      }

      if (moving) {
        movables.forEach((movable) => {
          movable.position.y -= CONFIG.SPEED;
        });
      }
    }

    // ==========================================
    // DÉPLACEMENT GAUCHE (touche Q)
    // ==========================================
    else if (keys.q.pressed) {
      player.moving = true;
      player.image = player.sprites.left;
      moving = true;

      for (let boundary of boundaries) {
        if (
          rectangularCollision({
            rectangle1: {
              ...player,
              position: {
                x: player.position.x - CONFIG.SPEED,
                y: player.position.y,
              },
            },
            rectangle2: boundary,
          })
        ) {
          moving = false;
          break;
        }
      }

      if (
        moving &&
        checkObjectCollision(
          player,
          allInteractiveObjects,
          "left",
          CONFIG.SPEED,
        )
      ) {
        moving = false;
      }

      if (moving) {
        movables.forEach((movable) => {
          movable.position.x += CONFIG.SPEED;
        });
      }
    }

    // ==========================================
    // DÉPLACEMENT DROITE (touche D)
    // ==========================================
    else if (keys.d.pressed) {
      player.moving = true;
      player.image = player.sprites.right;
      moving = true;

      for (let boundary of boundaries) {
        if (
          rectangularCollision({
            rectangle1: {
              ...player,
              position: {
                x: player.position.x + CONFIG.SPEED,
                y: player.position.y,
              },
            },
            rectangle2: boundary,
          })
        ) {
          moving = false;
          break;
        }
      }

      if (
        moving &&
        checkObjectCollision(
          player,
          allInteractiveObjects,
          "right",
          CONFIG.SPEED,
        )
      ) {
        moving = false;
      }

      if (moving) {
        movables.forEach((movable) => {
          movable.position.x -= CONFIG.SPEED;
        });
      }
    }
  }
}

// ==========================================
// GESTION DES CLICS SOURIS (SÉLECTION DU PERSONNAGE)
// ==========================================
canvas.addEventListener("click", function handleMenuClick(e) {
  if (gameState === "MENU") {
    const choix = menu.handleClick(e);
    if (choix) {
      personnageChoisi = choix;
      gameState = "PLAYING";

      // Afficher l'interface de jeu (menu burger + cœurs)
      toggleBurgerMenu(true);
      toggleHealthDisplay(true);

      // Activer l'inventaire visuel
      inventory.activerInventaire();

      // Charger les sprites selon le personnage choisi
      const playerImages =
        choix === "feminin"
          ? {
              down: playerDownImage,
              up: playerUpImage,
              left: playerLeftImage,
              right: playerRightImage,
            }
          : {
              down: player2DownImage,
              up: player2UpImage,
              left: player2LeftImage,
              right: player2RightImage,
            };

      // Créer le joueur au centre de l'écran
      player = new Sprite({
        position: {
          x: canvas.width / 2 - 240 / 4 / 1.65,
          y: canvas.height / 2 - 67 / 2,
        },
        image: playerImages.down,
        frames: { max: 4 },
        sprites: playerImages,
      });
    }
  }
});

// ==========================================
// INITIALISER LES CONTRÔLES TACTILES (D-PAD)
// ==========================================
const btns = document.querySelectorAll(".dpad-btn");
initMovements(btns, keys);

// ==========================================
// DÉBLOQUER L'AUDIO AU PREMIER CLIC
// ==========================================
document.addEventListener(
  "click",
  () => {
    audioManager.unlockAudio();
  },
  { once: true },
);

// ==========================================
// LANCER LA BOUCLE DE JEU
// ==========================================
animate();
