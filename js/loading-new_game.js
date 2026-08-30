const newGameButton = document.querySelector("#new-game-button");
const loadingScreen = document.querySelector("#loading-screen");
const loadingBar = document.querySelector("#loading-bar");
const loadingStatus = document.querySelector("#loading-status");
const loadingProgress = document.querySelector(".loading-track");

newGameButton.addEventListener("click", () => {
  const loadingDuration = 2000; // 2 seconds
  const startTime = performance.now();

  document.body.classList.add("is-loading");
  loadingScreen.classList.add("is-visible");
  newGameButton.disabled = true;

  const updateProgress = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / loadingDuration, 1);
    const percentage = Math.round(progress * 100);

    loadingBar.style.width = `${percentage}%`;
    loadingProgress.setAttribute("aria-valuenow", percentage);
    loadingStatus.textContent = progress < 1 ? `Carregando... ${percentage}%` : "A aventura começa!";

    if (progress < 1) {
      requestAnimationFrame(updateProgress);
      return;
    }

    document.body.classList.remove("is-loading");
    loadingScreen.classList.remove("is-visible");
    loadingScreen.setAttribute("aria-hidden", "true");
    sessionStorage.setItem("batalhaPotenciasMostrarHistoria", "true");
    window.location.href = "pages/mapa.html";
  };

  requestAnimationFrame(updateProgress);
});
