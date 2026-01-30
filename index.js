const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d"); // c = contexte du canvas
// L'écran de démarrage
const startScreen = document.getElementById("startScreen");
const startGameBtn = document.getElementById("startGameBtn");
const characterButtons = document.querySelectorAll(".character-choice button");
let selectedCharacter = null;

characterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedCharacter = button.dataset.character;

    // Effet visuel : l'autre bouton devient un peu transparent
    characterButtons.forEach((btn) => {
      if (btn !== button) {
        btn.style.opacity = 0.6;
      } else {
        btn.style.opacity = 1;
      }
    });
  });
});

startGameBtn.addEventListener("click", () => {
  if (!selectedCharacter) {
    alert("Choisissez un personnage !");
    return;
  }

  menuAudio.Menu.src.pause();
  menuAudio.Menu.src.currentTime = 0;

  // Play game music (looped) uniquement si un personnage est choisi
  villageAudio.Village.src.play();

  startScreen.style.display = "none";
  document.getElementById("game-page").style.display = "block";

  if (selectedCharacter === "male") {
    player.image = player2DownImage;
    player.sprites = {
      up: player2UpImage,
      left: player2LeftImage,
      right: player2RightImage,
      down: player2DownImage,
    };
  } else {
    player.image = playerDownImage;
    player.sprites = {
      up: playerUpImage,
      left: playerLeftImage,
      right: playerRightImage,
      down: playerDownImage,
    };
  }
});

canvas.width = 1024; // largeur du canvas
canvas.height = 576; // hauteur du canvas

c.scale(1, 1); // tout sera 2x plus grand
// Découpe le tableau de collisions en sous-tableaux (70 colonnes par ligne) car sur le logiciel de tiled c'était 70 de largeur , faire en fonction
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, i + 70)); // je coupe le tableau collisions toutes les 70 cases
}

// Classe pour les murs / obstacles
class Boundary {
  static width = 48; // largeur standard pour le calcul de position
  static height = 48; // hauteur standard pour le calcul de position
  constructor({ position }) {
    this.position = position;
    this.width = 34; // largeur réelle pour le rectangle invisible
    this.height = 28; // hauteur réelle
  }

  draw() {
    c.fillStyle = "rgba(255, 255, 255, 0)"; // invisible
    c.fillRect(this.position.x, this.position.y, this.width, this.height); // dessine le rectangle
  }
}

const boundaries = []; // tableau de tous les obstacles
const offset = { x: -748, y: -650 }; // offset pour le background et les obstacles

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

// Images du jeu

// la map
const image = new Image();
image.src = "./img/pelletTown.png"; // background

const foregroundImage = new Image();
foregroundImage.src = "./img/foreground.png";
// La fille
const playerDownImage = new Image();
playerDownImage.src = "./img/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "./img/playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./img/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "./img/playerRight.png";
// Le garcon

const player2DownImage = new Image();
player2DownImage.src = "./img/player2Down.png";

const player2UpImage = new Image();
player2UpImage.src = "./img/player2Up.png";

const player2LeftImage = new Image();
player2LeftImage.src = "./img/player2Left.png";

const player2RightImage = new Image();
player2RightImage.src = "./img/player2Right.png";
// Items
const coffreImg = new Image();
coffreImg.src = "./img/coffre.png";

const keyImg = new Image();
keyImg.src = "./img/key.png";

const parcheminImg = new Image();
parcheminImg.src = "./img/parchemin.png";

// Les objets
class Item {
  constructor({ position, image }) {
    this.position = position;
    this.image = image;
    this.width = 62;
    this.height = 62;
  }
  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
    );
  }
}
// Classe pour les sprites (player, background…)
class Sprite {
  constructor({ position, image, frames = { max: 1 }, sprites }) {
    this.position = position; // position du sprite
    this.image = image; // image du sprite
    this.frames = { ...frames, val: 0, elapsed: 0 }; // animation
    this.sprites = sprites; // images pour les directions
    this.moving = false; // pour savoir si le sprite bouge

    this.width = 48;
    this.height = 48;

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max; // largeur d'une frame
      this.height = this.image.height; // hauteur
    };
  }

  
  draw() {
    // dessine le sprite avec animation si nécessaire
    c.drawImage(
      this.image,
      this.frames.val * this.width, // crop X
      0, // crop Y
      this.image.width / this.frames.max, // largeur frame
      this.image.height, // hauteur frame
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height,
    );

    if (!this.moving) return; // si pas en mouvement, on ne fait pas d'animation

    if (this.frames.max > 1) this.frames.elapsed++; // incrémente le compteur d'animation
    if (this.frames.elapsed % 9 === 0) {
      // toutes les 9 frames on change la frame
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
}

// Création du background
const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const foreground = new Sprite({
  position: {
    x: (offset.x += 432),
    y: (offset.y += 145),
  },
  image: foregroundImage,
});

// Création du perso
const player = new Sprite({
  position: {
    x: canvas.width / 2 - 240 / 4 / 1.65,
    y: canvas.height / 2 - 67 / 2,
  },
  image: playerDownImage,
  frames: { max: 4 },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage,
  },
});

// la taille du perso

// Gestion des touches
const keys = {
  z: { pressed: false },
  s: { pressed: false },
  q: { pressed: false },
  d: { pressed: false },
  e: { pressed: false }
};

const cle = new Item({
  position: {
    x: canvas.width / 2 - 16, // centré horizontalement (32 / 2)
    y: canvas.height / 2 - 16, // centré verticalement
  },
  image: keyImg,
});

// Les positions des items
cle.position.y -= 290;
cle.position.x -= 280;

const parchemin = new Item({
  position: { x: canvas.width + 50, y: canvas.height / 2 - 16 },
  image: parcheminImg,
});

parchemin.position.y += 90;
parchemin.position.x += 610;

const coffre = new Item({
  position: { x: canvas.width / 2 - 50, y: canvas.height / 2 - 16 },
  image: coffreImg,
});

coffre.position.y -= 370;
coffre.position.x += 540;

// Tous les éléments qui doivent bouger avec le perso
const movables = [
  background,
  ...boundaries,
  foreground,
  cle,
  parchemin,
  coffre,
]; // les trois petits point sert a reprendre les mêmes propriétés "spread" faut pas que j'oublie

//  la collision entre 2 rectangles
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height
  );
}

// Gestion du parchemin

const closeOverlayParchemin = document.getElementById("exitButton");
closeOverlayParchemin.addEventListener("click", closeAllOverlays);

let canInteractWithParchemin = false;

let parcheminCollected = false;
let showParcheminHint = false;
let overlayOpen = false;
function parcheminInteraction() {
  if (
    !parcheminCollected &&
    rectangularCollision({
      rectangle1: player,
      rectangle2: parchemin,
    })
  ) {
    canInteractWithParchemin = true;
    showParcheminHint = true;
  } else {
    canInteractWithParchemin = false;
    showParcheminHint = false;
  }
}

function drawParcheminHint() {
  if (!showParcheminHint || parcheminCollected) return;

  c.fillStyle = "white";
  c.font = "16px Arial";
  c.fillText("(E) Interagir", parchemin.position.x, parchemin.position.y - 10);
}
function openParchemin() {
  overlayOpen = true;
  document.getElementById("messageOverlayParchemin").style.display = "block";
}

// Le contenu de l'overlay key
function openKey() {
  overlayOpen = true;
  document.getElementById("messageOverlayKey").style.display = "block";
}

function closeAllOverlays() {
  overlayOpen = false;
  document.getElementById("messageOverlayParchemin").style.display = "none";
  document.getElementById("messageOverlayKey").style.display = "none";
  // document.getElementById("messageOverlayCoffre").style.display = "none";
}

const closeOverlayKey = document.getElementById("exitButtonK");
closeOverlayKey.addEventListener("click", closeAllOverlays);

let keyCollected = false;
let showKeyHint = false;

// Gestion de la clé
let canInteractWithKey = false;

function keyInteraction() {
  if (
    !keyCollected &&
    rectangularCollision({
      rectangle1: player,
      rectangle2: cle,
    })
  ) {
    canInteractWithKey = true;
    showKeyHint = true;
  } else {
    canInteractWithKey = false;
    showKeyHint = false;
  }
}

function drawKey() {
  if (!keyCollected) {
    c.drawImage(keyImg, cle.position.x, cle.position.y, cle.width, cle.height);
  }
}
function drawKeyHint() {
  if (!showKeyHint || keyCollected) return;

  c.fillStyle = "white";
  c.font = "16px Arial";
  c.fillText("(E) Interagir", cle.position.x, cle.position.y - 10);
}
// Gestion du coffre

let canInteractWithCoffre = false;
let coffreOpened = false;
let showCoffreHint = false;

function coffreInteraction() {
  if (!coffreOpened) {
    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: coffre,
      })
    ) {
      canInteractWithCoffre = true;
      showCoffreHint = true;
    } else {
      canInteractWithCoffre = false;
      showCoffreHint = false;
    }
  }
}

function drawCoffreHint() {
  if (!showCoffreHint || coffreOpened) return;

  c.fillStyle = "white";
  c.font = "16px Arial";

  if (!keyCollected) {
    c.fillText(
      "Il vous faut une clé pour ouvrir le coffre",
      coffre.position.x,
      coffre.position.y - 10,
    );
  } else {
    c.fillText(
      "(E) Ouvrir le coffre",
      coffre.position.x,
      coffre.position.y - 10,
    );
  }
}
function openCoffre() {
  coffreOpened = true;
  overlayOpen = true;

  villageAudio.Village.src.pause();
  villageAudio.Village.src.currentTime = 0;

  endMusic.End.src.play();
  endMusic.End.src.loop = true;

  document.getElementById("messageOverlayCoffre").style.display = "block";
}

const closeOverlayCoffre = document.getElementById("exitButtonC");

closeOverlayCoffre.addEventListener("click", () => {
  // Ferme l'overlay du coffre
  document.getElementById("messageOverlayCoffre").style.display = "none";

  overlayOpen = false;

  if (coffreOpened) {
    document.getElementById("curtain").classList.add("active");
  }
});

function animate() {
  window.requestAnimationFrame(animate);
  background.draw(); // dessine le fond

  if (!keyCollected) {
    cle.draw();
  }

  if (!parcheminCollected) {
    parchemin.draw();
  }
  coffreInteraction();

  drawCoffreHint();
  if (!coffreOpened) {
    coffre.draw();
  }
  if (coffreOpened) {
    coffre.position.x = -1000;
    coffre.position.y = -1000; // sort le coffre du cadre de la map
  }
  boundaries.forEach((boundary) => boundary.draw()); // dessine les obstacles

  player.draw(); // dessine le perso
  foreground.draw(); // dessine le premier plan

  //  Le parchemin
  parcheminInteraction();
  drawParcheminHint();

  // La clé

  keyInteraction();
  drawKeyHint();

  // Le deplacement

  const SPEED = 4;

  let moving = true;
  player.moving = false;

  // HAUT
  if (keys.z.pressed) {
    player.moving = true;
    player.image = player.sprites.up;

    for (let boundary of boundaries) {
      if (
        rectangularCollision({
          rectangle1: {
            ...player,
            position: { x: player.position.x, y: player.position.y - SPEED },
          },
          rectangle2: boundary,
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving) movables.forEach((m) => (m.position.y += SPEED));
  }

  // BAS
  if (keys.s.pressed) {
    player.moving = true;
    player.image = player.sprites.down;

    for (let boundary of boundaries) {
      if (
        rectangularCollision({
          rectangle1: {
            ...player,
            position: { x: player.position.x, y: player.position.y + SPEED },
          },
          rectangle2: boundary,
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving) movables.forEach((m) => (m.position.y -= SPEED));
  }

  // GAUCHE
  if (keys.q.pressed) {
    player.moving = true;
    player.image = player.sprites.left;

    for (let boundary of boundaries) {
      if (
        rectangularCollision({
          rectangle1: {
            ...player,
            position: { x: player.position.x - SPEED, y: player.position.y },
          },
          rectangle2: boundary,
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving) movables.forEach((m) => (m.position.x += SPEED));
  }

  // DROITE
  if (keys.d.pressed) {
    player.moving = true;
    player.image = player.sprites.right;

    for (let boundary of boundaries) {
      if (
        rectangularCollision({
          rectangle1: {
            ...player,
            position: { x: player.position.x + SPEED, y: player.position.y },
          },
          rectangle2: boundary,
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving) movables.forEach((m) => (m.position.x -= SPEED));
  }
}

// écoute les touches enfoncées
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "z":
      keys.z.pressed = true;
      break;
    case "q":
      keys.q.pressed = true;
      break;
    case "s":
      keys.s.pressed = true;
      break;
    case "d":
      keys.d.pressed = true;
      break;
      case "e":
      keys.e.pressed = true;
      break;
  }
});

// écoute les touches relâchées
window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "z":
      keys.z.pressed = false;
      break;
    case "q":
      keys.q.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "e":
      keys.e.pressed = false;
      break;
  }
});

window.addEventListener("keydown", (e) => {
  // Ferme les overlays si overlay ouvert et touche 'E' ou 'Escape'
  if (overlayOpen && (e.key === "e" || e.key === "Escape")) {
    closeAllOverlays();

    // Si le coffre a été ouvert, fait tomber le rideau après avoir fermé l'overlay
    if (coffreOpened && closeOverlayCoffre) {
      document.getElementById("curtain").classList.add("active");

      setTimeout(() => {
        console.log("Ici tu peux lancer les crédits !");
      }, 2000); // durée = celle du transition CSS
    }
  }

  if (e.key === "e") {
    // Parchemin
    if (canInteractWithParchemin && !parcheminCollected) {
      parcheminCollected = true;
      showParcheminHint = false;
      openParchemin();
    }

    // Clé
    if (canInteractWithKey && !keyCollected) {
      keyCollected = true;
      showKeyHint = false;
      openKey();
    }

    // Coffre
    if (canInteractWithCoffre && !coffreOpened) {
      if (!keyCollected) {
        alert("Il vous faut une clé pour ouvrir ce coffre !");
      } else {
        openCoffre();
      }
    }
  }
});

animate();
// Le menu


const btns = document.querySelectorAll(".btn");
const actionBtn = document.querySelector(".action-btn");

// Directions
btns.forEach((btn) => {
  // Appui
  btn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const direction = btn.dataset.direction;
    if (direction === "haut") keys.z.pressed = true;
    if (direction === "bas") keys.s.pressed = true;
    if (direction === "gauche") keys.q.pressed = true;
    if (direction === "droite") keys.d.pressed = true;
    btn.classList.add('active');
    
  });

  // Relâchement
  btn.addEventListener("touchend", (e) => {
    e.preventDefault();
    const direction = btn.dataset.direction;
    if (direction === "haut") keys.z.pressed = false;
    if (direction === "bas") keys.s.pressed = false;
    if (direction === "gauche") keys.q.pressed = false;
    if (direction === "droite") keys.d.pressed = false;
    btn.classList.remove('active');
  });
});

actionBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  // Crée et dispatche un vrai événement clavier
  const event = new KeyboardEvent("keydown", { key: "e" });
  window.dispatchEvent(event);
  actionBtn.classList.add('active');
});

// Action E
actionBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  keys.e.pressed = true;
  actionBtn.classList.add('active');
});

actionBtn.addEventListener("touchend", (e) => {
  e.preventDefault();
  keys.e.pressed = false;
  actionBtn.classList.remove('active');
});


const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");
const closeMenu = document.getElementById("closeMenu");
const backToStart = document.getElementById("demarrageButton");

hamburger.addEventListener("click", () => menu.classList.toggle("show"));
closeMenu.addEventListener("click", () => menu.classList.remove("show"));
