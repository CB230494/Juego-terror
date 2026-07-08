const startScreen = document.getElementById('startScreen');
const doorScreen = document.getElementById('doorScreen');
const resultScreen = document.getElementById('resultScreen');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const doors = document.querySelectorAll('.door');
const countdownBox = document.getElementById('countdownBox');
const countdownText = document.getElementById('countdownText');
const countNumber = document.getElementById('countNumber');
const resultCard = document.getElementById('resultCard');
const resultMini = document.getElementById('resultMini');
const resultTitle = document.getElementById('resultTitle');
const resultImage = document.getElementById('resultImage');
const resultText = document.getElementById('resultText');
const flash = document.getElementById('flash');
const bloodRain = document.getElementById('bloodRain');

const helpAudio = document.getElementById('helpAudio');
const suspenseAudio = document.getElementById('suspenseAudio');
const raptorAudio = document.getElementById('raptorAudio');

let correctDoor = randomDoor();
let playing = false;
let bloodTimer = null;

function randomDoor() {
  return Math.random() < 0.5 ? '1' : '2';
}

function showScreen(screen) {
  [startScreen, doorScreen, resultScreen].forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
}

function resetAudio() {
  [helpAudio, suspenseAudio, raptorAudio].forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
}

function playAudio(audio, volume = 1) {
  audio.volume = volume;
  audio.play().catch(() => {});
}

function startBlood() {
  stopBlood();
  bloodTimer = setInterval(() => {
    const drop = document.createElement('span');
    drop.className = 'drop';
    drop.style.left = Math.random() * 100 + 'vw';
    drop.style.animationDuration = 3 + Math.random() * 4 + 's';
    drop.style.opacity = .25 + Math.random() * .55;
    bloodRain.appendChild(drop);
    setTimeout(() => drop.remove(), 7500);
  }, 230);
}

function stopBlood() {
  if (bloodTimer) clearInterval(bloodTimer);
  bloodTimer = null;
  bloodRain.innerHTML = '';
}

function startGame() {
  correctDoor = randomDoor();
  playing = true;
  doors.forEach(door => {
    door.disabled = false;
    door.classList.remove('opening');
  });
  countdownBox.classList.add('hidden');
  resultCard.className = 'result-card';
  document.body.classList.remove('shaking');
  flash.classList.remove('active');
  resetAudio();
  playAudio(helpAudio, 0.85);
  startBlood();
  showScreen(doorScreen);
}

function openDoor(selectedDoor, doorElement) {
  if (!playing) return;
  playing = false;
  doors.forEach(door => door.disabled = true);
  doorElement.classList.add('opening');

  helpAudio.volume = 0.24;
  playAudio(suspenseAudio, 0.9);
  flash.classList.add('active');
  document.body.classList.add('shaking');

  countdownBox.classList.remove('hidden');
  countdownText.textContent = 'La puerta se está abriendo...';

  let number = 3;
  countNumber.textContent = number;

  const timer = setInterval(() => {
    number--;
    if (number > 0) {
      countNumber.textContent = number;
      countdownText.textContent = number === 2 ? 'Algo se mueve detrás...' : 'Ya casi...';
    } else {
      clearInterval(timer);
      countNumber.textContent = '¡!';
      setTimeout(() => {
        selectedDoor === correctDoor ? winGame() : loseWarning();
      }, 650);
    }
  }, 1100);
}

function winGame() {
  document.body.classList.remove('shaking');
  flash.classList.remove('active');
  stopBlood();
  suspenseAudio.pause();
  helpAudio.pause();

  resultCard.className = 'result-card';
  resultMini.textContent = 'Rescate logrado';
  resultTitle.textContent = '¡GANASTE!';
  resultImage.src = 'assets/persona-herida.png';
  resultText.textContent = 'Abriste la puerta correcta. Encontraste a la persona herida y lograste ayudarla antes de que fuera demasiado tarde.';
  showScreen(resultScreen);
}

function loseWarning() {
  countdownText.textContent = 'No era esa puerta... corre.';
  countNumber.textContent = '3';

  let number = 3;
  const timer = setInterval(() => {
    number--;
    if (number > 0) {
      countNumber.textContent = number;
    } else {
      clearInterval(timer);
      countNumber.textContent = 'CORRE';
      setTimeout(loseGame, 900);
    }
  }, 900);
}

function loseGame() {
  helpAudio.pause();
  suspenseAudio.volume = 0.18;
  raptorAudio.currentTime = 0;
  playAudio(raptorAudio, 1);
  startBlood();

  resultCard.className = 'result-card dead';
  resultMini.textContent = 'Puerta equivocada';
  resultTitle.textContent = 'LOS RAPTORES TE ENCONTRARON';
  resultImage.src = 'assets/tacano.jpg';
  resultText.textContent = 'Los dinosaurios salieron de la oscuridad. Intentaste correr, pero fue demasiado tarde. Los dinosaurios te comieron.';
  showScreen(resultScreen);

  setTimeout(() => {
    document.body.classList.remove('shaking');
    flash.classList.remove('active');
    suspenseAudio.pause();
  }, 4200);
}

function goHome() {
  playing = false;
  resetAudio();
  stopBlood();
  document.body.classList.remove('shaking');
  flash.classList.remove('active');
  doors.forEach(door => {
    door.disabled = false;
    door.classList.remove('opening');
  });
  countdownBox.classList.add('hidden');
  showScreen(startScreen);
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', goHome);
doors.forEach(door => {
  door.addEventListener('click', () => openDoor(door.dataset.door, door));
});
