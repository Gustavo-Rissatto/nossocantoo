/*
  TIMER_ATIVO:
  false = abre o app agora
  true = bloqueia e libera apenas no próximo dia 04
*/
const TIMER_ATIVO = false;

const DATA_PEDIDO = new Date("2026-06-04T00:00:00");
const app = document.getElementById("app");
const bloqueado = document.getElementById("bloqueado");
const timer = document.getElementById("timer");
const audio = document.getElementById("audio");
const musicBtn = document.getElementById("musicBtn");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const musicCover = document.getElementById("musicCover");

function proximoDia04() {
  const agora = new Date();
  let data = new Date(agora.getFullYear(), agora.getMonth(), 4, 0, 0, 0);

  if (agora >= data) {
    data = new Date(agora.getFullYear(), agora.getMonth() + 1, 4, 0, 0, 0);
  }

  return data;
}

const dataLiberacao = proximoDia04();

function liberarApp() {
  app.style.display = "block";
  bloqueado.style.display = "none";
}

function mostrarBloqueio() {
  app.style.display = "none";
  bloqueado.style.display = "flex";
}

function atualizarTimer() {
  if (!TIMER_ATIVO) {
    liberarApp();
    return;
  }

  const agora = new Date();
  const diff = dataLiberacao - agora;

  if (diff <= 0) {
    liberarApp();
    return;
  }

  mostrarBloqueio();

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diff / (1000 * 60)) % 60);
  const segundos = Math.floor((diff / 1000) % 60);

  timer.innerHTML = `
    <div><strong>${String(dias).padStart(2, "0")}</strong><span>dias</span></div>
    <div><strong>${String(horas).padStart(2, "0")}</strong><span>horas</span></div>
    <div><strong>${String(minutos).padStart(2, "0")}</strong><span>min</span></div>
    <div><strong>${String(segundos).padStart(2, "0")}</strong><span>seg</span></div>
  `;
}

function liberarModoTeste() {
  liberarApp();
}

function entrarNoApp() {
  goTo("musica");
  if (audio.paused) {
    audio.volume = 0.75;
    audio.play().then(() => {
      musicBtn.innerText = "⏸️ Pausar música";
      musicCover.classList.add("playing");
    }).catch(() => {});
  }
}

function goTo(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

function abrirEnvelope() {
  const envelope = document.querySelector(".envelope");
  envelope.classList.add("open");

  setTimeout(() => {
    document.getElementById("envelopeWrap").style.display = "none";
    document.getElementById("cartaAberta").classList.remove("hidden");
  }, 650);
}

function mostrarCategoria(id) {
  document.querySelectorAll(".carousel").forEach(el => el.classList.remove("active-cat"));
  document.getElementById(id).classList.add("active-cat");
}

function abrirZoom(src) {
  document.getElementById("zoomImg").src = src;
  document.getElementById("zoom").style.display = "flex";
}

function fecharZoom() {
  document.getElementById("zoom").style.display = "none";
}

function playVideo() {
  const video = document.getElementById("nossoVideo");
  video.play();
  video.scrollIntoView({ behavior: "smooth", block: "center" });
}

function toggleMusic() {
  if (audio.paused) {
    audio.play().then(() => {
      musicBtn.innerText = "⏸️ Pausar música";
      musicCover.classList.add("playing");
    });
  } else {
    audio.pause();
    musicBtn.innerText = "▶️ Tocar música";
    musicCover.classList.remove("playing");
  }
}

function formatarTempo(segundos) {
  if (!Number.isFinite(segundos)) return "0:00";
  const min = Math.floor(segundos / 60);
  const sec = Math.floor(segundos % 60);
  return `${min}:${String(sec).padStart(2, "0")}`;
}

audio.addEventListener("loadedmetadata", () => {
  progress.max = Math.floor(audio.duration);
  durationEl.innerText = formatarTempo(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  progress.value = Math.floor(audio.currentTime);
  currentTimeEl.innerText = formatarTempo(audio.currentTime);
});

progress.addEventListener("input", () => {
  audio.currentTime = progress.value;
});

function atualizarContadorRelacao() {
  const agora = new Date();
  const diff = Math.max(0, agora - DATA_PEDIDO);

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diff / (1000 * 60)) % 60);

  document.getElementById("dias").innerText = dias;
  document.getElementById("horas").innerText = horas;
  document.getElementById("minutos").innerText = minutos;
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}

setInterval(atualizarTimer, 1000);
setInterval(atualizarContadorRelacao, 30000);
atualizarTimer();
atualizarContadorRelacao();
