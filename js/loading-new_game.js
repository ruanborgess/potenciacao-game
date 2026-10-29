/* Referências aos botões originais do menu e aos elementos das telas. */
const newGameButton = document.querySelector("#new-game-button");
const continueButton = document.querySelector("#continue-game-button");
const optionsButton = document.querySelector("#options-button");
const optionsScreen = document.querySelector("#options-screen");
const closeOptionsButton = document.querySelector("#close-options-button");
const backFromOptionsButton = document.querySelector("#back-from-options-button");
const continueNotice = document.querySelector("#continue-notice");
const dismissContinueNoticeButton = document.querySelector("#dismiss-continue-notice");
const loadingScreen = document.querySelector("#loading-screen");
const loadingBar = document.querySelector("#loading-bar");
const loadingStatus = document.querySelector("#loading-status");
const loadingProgress = document.querySelector(".loading-track");

/* Exibe o carregamento antes de abrir o mapa para iniciar uma nova aventura. */
function startLoading() {
  const loadingDuration = 2000;
  const startTime = performance.now();

  optionsScreen.hidden = true;
  document.body.classList.add("is-loading");
  loadingScreen.classList.add("is-visible");
  loadingScreen.setAttribute("aria-hidden", "false");
  newGameButton.disabled = true;

  /* Atualiza a barra de progresso até concluir a entrada no mapa. */
  const updateProgress = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / loadingDuration, 1);
    const percentage = Math.round(progress * 100);

    loadingBar.style.width = `${percentage}%`;
    loadingProgress.setAttribute("aria-valuenow", percentage);
    loadingStatus.textContent = progress < 1
      ? `Carregando... ${percentage}%`
      : "A aventura começa!";

    if (progress < 1) {
      requestAnimationFrame(updateProgress);
      return;
    }

    /* Marca a introdução para que ela seja exibida ao entrar no mapa. */
    try {
      sessionStorage.setItem("batalhaPotenciasMostrarHistoria", "true");
    } catch {
      // A navegação continua mesmo se o navegador bloquear o armazenamento da sessão.
    }

    window.location.href = "pages/mapa.html";
  };

  requestAnimationFrame(updateProgress);
}

/* New Game inicia a aventura e exibe a introdução da história. */
newGameButton.addEventListener("click", () => {
  startLoading();
});

/* Continuar abre um aviso próprio do jogo caso ainda não exista aventura iniciada. */
continueButton.addEventListener("click", () => {
  continueNotice.hidden = false;
  dismissContinueNoticeButton.focus();
});

/* Fecha o aviso e devolve o foco ao botão Continuar do menu. */
function closeContinueNotice() {
  continueNotice.hidden = true;
  continueButton.focus();
}

dismissContinueNoticeButton.addEventListener("click", closeContinueNotice);
continueNotice.querySelectorAll("[data-close-continue-notice]").forEach((button) => {
  button.addEventListener("click", closeContinueNotice);
});

/* Abre a tela de opções sem alterar os botões existentes no menu. */
optionsButton.addEventListener("click", () => {
  optionsScreen.hidden = false;
  closeOptionsButton.focus();
});

/* Fecha as opções e devolve o foco ao botão original do menu. */
function closeOptions() {
  optionsScreen.hidden = true;
  optionsButton.focus();
}

closeOptionsButton.addEventListener("click", closeOptions);
backFromOptionsButton.addEventListener("click", closeOptions);
optionsScreen.querySelectorAll("[data-close-options]").forEach((button) => {
  button.addEventListener("click", closeOptions);
});

/* Permite fechar a tela de opções usando Escape. */
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !optionsScreen.hidden) closeOptions();
  if (event.key === "Escape" && !continueNotice.hidden) closeContinueNotice();
});

/* Atualiza os valores exibidos nos controles de volume ilustrativos. */
document.querySelectorAll(".option-range-row input[type='range']").forEach((range) => {
  range.addEventListener("input", () => {
    range.parentElement.querySelector("output").value = `${range.value}%`;
  });
});
