const scene = document.querySelector("#letterScene");
const openButton = document.querySelector("#openLetterButton");
const musicToggle = document.querySelector("#musicToggle");
const bgMusic = document.querySelector("#bgMusic");
const voiceButton = document.querySelector("#voiceNoteButton");
const voiceStatus = document.querySelector("#voiceNoteStatus");
const voiceAudio = document.querySelector("#voiceNoteAudio");
const voiceDuration = document.querySelector(".voice-duration");
const petalLayer = document.querySelector("#petalLayer");

let hasOpened = false;
let shouldResumeMusicAfterVoice = false;

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

function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
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
  if (!voiceAudio.paused) {
    voiceAudio.pause();
    shouldResumeMusicAfterVoice = false;
    setVoicePlaying(false);
  }

  if (bgMusic.paused) {
    playMusic();
    return;
  }

  bgMusic.pause();
  musicToggle.textContent = "Music Off";
  musicToggle.setAttribute("aria-label", "播放音乐");
}

function setVoicePlaying(isPlaying) {
  voiceButton.classList.toggle("is-playing", isPlaying);
  voiceStatus.textContent = isPlaying ? "正在播放" : "语音留言";
  voiceButton.setAttribute("aria-label", isPlaying ? "暂停语音留言" : "播放语音留言");
}

function resumeMusicAfterVoice() {
  setVoicePlaying(false);

  if (!shouldResumeMusicAfterVoice) {
    return;
  }

  shouldResumeMusicAfterVoice = false;
  playMusic();
}

async function playVoiceNote() {
  shouldResumeMusicAfterVoice = !bgMusic.paused;

  if (shouldResumeMusicAfterVoice) {
    bgMusic.pause();
  }

  try {
    await voiceAudio.play();
    setVoicePlaying(true);
  } catch {
    setVoicePlaying(false);
    resumeMusicAfterVoice();
  }
}

function toggleVoiceNote() {
  if (!voiceAudio.paused) {
    voiceAudio.pause();
    resumeMusicAfterVoice();
    return;
  }

  if (voiceAudio.ended) {
    voiceAudio.currentTime = 0;
  }

  playVoiceNote();
}

function updateVoiceDuration() {
  voiceDuration.textContent = formatDuration(voiceAudio.duration);
}

openButton.addEventListener("click", openLetter);
musicToggle.addEventListener("click", toggleMusic);
voiceButton.addEventListener("click", toggleVoiceNote);
voiceAudio.addEventListener("ended", resumeMusicAfterVoice);
voiceAudio.addEventListener("loadedmetadata", updateVoiceDuration);
createPetals();
