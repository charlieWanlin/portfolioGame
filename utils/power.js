import { lancerIntro, quandIntroFinie } from "./videos.js";
import audioManager from "./audio.js";
import { resetGameFromPower } from ".././main.js";

const led = document.querySelector(".ledPower");
const indicateur = document.querySelector(".indicateurPower");
const ecranNoir = document.querySelector(".ecranNoir");

let powerOn = false;
let isIntroPlaying = false;
let isShuttingDown = false;

// Fonction commune pour gérer le toggle
const handlePowerToggle = () => {
  if (isIntroPlaying || isShuttingDown) return;

  powerOn = !powerOn;

  if (powerOn) {
    led.classList.add("on");
    isIntroPlaying = true;

    setTimeout(() => {
      lancerIntro();
      ecranNoir.style.transition = "opacity 0.5s";
      ecranNoir.style.opacity = "0";
      setTimeout(() => {
        ecranNoir.style.display = "none";
      }, 500);
    }, 800);

    quandIntroFinie(() => {
      isIntroPlaying = false;
      audioManager.playMenuMusic();
    });
  } else {
    led.classList.remove("on");
    isShuttingDown = true;
    audioManager.stopAll();
    audioManager.playOutroSound();

    setTimeout(() => {
      resetGameFromPower();
      console.log("ecranNoir element:", ecranNoir);
      console.log("display avant:", ecranNoir.style.display);
      console.log("opacity avant:", ecranNoir.style.opacity);

      ecranNoir.style.transition = "none";
      ecranNoir.style.opacity = "0";
      ecranNoir.style.display = "block";
      setTimeout(() => {
        ecranNoir.style.transition = "opacity 0.8s";
        ecranNoir.style.opacity = "1";
        isShuttingDown = false;
      }, 50);
    }, 2000);
  }
};

// Mobile
indicateur.addEventListener("touchend", (e) => {
  e.preventDefault();
  handlePowerToggle();
});

// Desktop
indicateur.addEventListener("click", handlePowerToggle);
