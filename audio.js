const menuAudio = {
  Menu: {
    src: new Audio("./audio/menuMusic.mp3"),
    html5: true,  // pour des bibliothèques commme howler par exemple 
  },
};


menuAudio.Menu.src.loop = true;
menuAudio.Menu.src.volume = 0.3;
const startMusicBtn = document.getElementById("startMusic");
const stopMusicBtn = document.getElementById("stopMusic");

startMusicBtn.addEventListener("click", () => {
  menuAudio.Menu.src.play();
});

stopMusicBtn.addEventListener("click", () => {
  menuAudio.Menu.src.pause();
  menuAudio.Menu.src.currentTime = 0; // remet au début
});


const villageAudio = {
  Village: {
    src: new Audio("./audio/villageMusic.mp3"),
  },
};

villageAudio.Village.src.loop = true;
villageAudio.Village.src.volume = 0.3;



const endMusic = {
  End: {
    src: new Audio("./audio/endMusic.mp3"),
  }
}
endMusic.End.src.loop = true;
endMusic.End.src.volume = 0.3;

