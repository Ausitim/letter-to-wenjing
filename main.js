const scene = document.querySelector("#letterScene");
const openButton = document.querySelector("#openLetterButton");
const musicToggle = document.querySelector("#musicToggle");
const bgMusic = document.querySelector("#bgMusic");
const petalLayer = document.querySelector("#petalLayer");

let hasOpened = false;

function createPetals() {
  const petalCount = 22;

  for (let index = 0; index < petalCount; index += 1) {
    const petal = document.createElement("span");
    const size = 10 + Math.random() * 16;
    const drift = -42 + Math.random() * 84;
    const duration = 9 + Math.random() * 9;
    const delay = Math.random() * -duration;

    petal.className = "petal";
    petal.style.setProperty("--petal-left", `${Math.random() * 100}%`);
    petal.style.setProperty("--petal-size", `${size}px`);
    petal.style.setProperty("--petal-drift", `${drift}px`);
    petal.style.setProperty("--petal-duration", `${duration}s`);
    petal.style.setProperty("--petal-delay", `${delay}s`);
    petal.style.setProperty("--petal-rotate", `${Math.random() * 360}deg`);
    petal.style.setProperty("--petal-opacity", `${0.32 + Math.random() * 0.42}`);
    petalLayer.appendChild(petal);
  }
}

async function playMusic() {
  try {
    await bgMusic.play();
    musicToggle.textContent = "Music On";
    musicToggle.setAttribute("aria-label", "暂停音乐");
  } catch {
    musicToggle.textContent = "Tap Music";
    musicToggle.setAttribute("aria-label", "播放音乐");
  }
}

function openLetter() {
  if (hasOpened) {
    return;
  }

  hasOpened = true;
  scene.classList.add("is-open");
  playMusic();
}

function toggleMusic() {
  if (bgMusic.paused) {
    playMusic();
    return;
  }

  bgMusic.pause();
  musicToggle.textContent = "Music Off";
  musicToggle.setAttribute("aria-label", "播放音乐");
}

openButton.addEventListener("click", openLetter);
musicToggle.addEventListener("click", toggleMusic);
createPetals();
