const storyScenes = [
  {
    image: "../assets/images/personagem.png",
    title: "O Reino Exponencial precisa de você.",
    text: "Em uma noite sem estrelas, a luz que protegia o reino desapareceu. Sem ela, os cálculos perderam a força e as vilas começaram a se apagar."
  },
  {
    image: "../assets/images/boss.png",
    title: "Potencius tomou o castelo.",
    text: "No alto da montanha, o feiticeiro Potencius roubou a energia das potências. Ele espalhou mini-chefões pelo caminho para impedir qualquer herói de chegar até ele."
  },
  {
    image: "../assets/images/personagem_bravo.png",
    title: "Sua jornada começa agora.",
    text: "Aprenda a usar base e expoente como aliados. A cada desafio vencido, você recuperará uma parte da energia do reino e ficará mais perto do castelo."
  },
  {
    image: "../assets/images/boss_bravo.png",
    title: "O desafio final espera por você.",
    text: "Não deixe o medo se multiplicar. Vença os guardiões, domine as potências e enfrente Potencius para devolver a luz ao Reino Exponencial."
  }
];

const storyCharacter = document.getElementById("story-character");
const storyStep = document.getElementById("story-step");
const storyTitle = document.getElementById("story-title");
const storyText = document.getElementById("story-text");
const storyStartButton = document.getElementById("story-start-button");
const introRequested = sessionStorage.getItem("batalhaPotenciasMostrarHistoria") === "true";
const finalRequested = new URLSearchParams(window.location.search).get("final") === "1";
let storyIndex = 0;

function renderStoryScene() {
  const scene = storyScenes[storyIndex];
  storyCharacter.src = scene.image;
  storyCharacter.className = `story-character story-character--scene-${storyIndex + 1}`;
  storyStep.textContent = `História ${storyIndex + 1} de ${storyScenes.length}`;
  storyTitle.textContent = scene.title;
  storyText.textContent = scene.text;
  storyStartButton.textContent = storyIndex === storyScenes.length - 1 ? "Iniciar aventura" : "Próximo";
}

if (introRequested && !finalRequested) {
  document.body.classList.add("story-active");
  sessionStorage.removeItem("batalhaPotenciasMostrarHistoria");
}

if (storyStartButton) {
  renderStoryScene();
  storyStartButton.addEventListener("click", () => {
    if (storyIndex < storyScenes.length - 1) {
      storyIndex += 1;
      renderStoryScene();
      return;
    }
    document.body.classList.remove("story-active");
    storyStartButton.blur();
  });
}

if (finalRequested) {
  document.getElementById("final-scene").hidden = false;
  sessionStorage.removeItem("batalhaPotenciasMostrarHistoria");
}

let lineIndex = 0;

const finalLines = [
  {
    speaker: "O HERÓI",
    title: "O silêncio depois da batalha",
    text: "A última luz explodiu em mil pontos dourados. Quando a poeira baixou, o castelo já não parecia uma prisão. Pela primeira vez, Potencius estava sem a coroa e sem o poder que roubara.",
    active: "hero"
  },
  {
    speaker: "POTENCIUS",
    title: "O que restou do poder",
    text: "Passei tanto tempo tentando ser maior que todos... que esqueci como se cresce de verdade. Cada potência que tomei só aumentou o vazio aqui dentro.",
    active: "villain"
  },
  {
    speaker: "O HERÓI",
    title: "Uma resposta diferente",
    text: "Uma potência não precisa diminuir ninguém para ser forte. Ela cresce quando é compartilhada. Você pode devolver a energia ao reino, Potencius. E pode ajudar a reconstruí-lo.",
    active: "hero"
  },
  {
    speaker: "POTENCIUS",
    title: "A escolha do feiticeiro",
    text: "Depois de tudo o que fiz... ainda me oferece uma chance? Então que minhas mãos desfaçam o que fizeram. Não peço que esqueçam. Só quero começar a reparar.",
    active: "villain"
  },
  {
    speaker: "O HERÓI",
    title: "A energia encontra o caminho de casa",
    text: "Potencius ergueu as mãos. A energia roubada deixou a torre e atravessou o céu como um rio de estrelas. As luzes voltaram às vilas, à Árvore dos Expoentes e ao Portão das Potências.",
    active: "hero"
  },
  {
    speaker: "POTENCIUS",
    title: "Um novo começo",
    text: "Não sei se algum dia serei perdoado. Mas, se me permitir, vou ensinar às próximas gerações o que demorei tanto para aprender: conhecimento fica mais poderoso quando passa de mão em mão.",
    active: "villain"
  },
  {
    speaker: "NARRADOR",
    title: "E o reino voltou a crescer",
    text: "O herói voltou para casa sob um céu aceso. Potencius ficou para reconstruir o castelo, pedra por pedra. E no Reino Exponencial, uma nova regra passou a valer: toda grande mudança começa com alguém disposto a aprender.",
    active: "hero"
  }
];

const scene = document.querySelector("#final-scene");
const credits = document.querySelector("#credits");
const speaker = document.querySelector("#speaker");
const title = document.querySelector("#dialogue-title");
const text = document.querySelector("#dialogue-text");
const button = document.querySelector("#next-line");
const hero = document.querySelector("#hero-character");
const villain = document.querySelector("#villain-character");


function renderLine() {
  const line = finalLines[lineIndex];[]
  scene.classList.add("changing");

  window.setTimeout(() => {
    speaker.textContent = line.speaker;
    title.textContent = line.title;
    text.textContent = line.text;
    hero.classList.toggle("is-speaking", line.active === "hero");
    villain.classList.toggle("is-speaking", line.active === "villain");

    const sceneClass = `final-character--scene-${lineIndex + 1}`;

    hero.className = `final-character hero-character${line.active === "hero" ? " is-speaking" : ""} ${sceneClass}`;

    villain.className = `final-character villain-character${line.active === "villain" ? " is-speaking" : ""} ${sceneClass}`;

    button.textContent = lineIndex === finalLines.length - 1
      ? "VER CRÉDITOS ✦"
      : "PRÓXIMO";
    scene.classList.remove("changing");
  }, 180);
}

button.addEventListener("click", () => {
  if (lineIndex < finalLines.length - 1) {
    lineIndex += 1;
    renderLine();
    return;
  }

  scene.classList.add("leaving");
  window.setTimeout(() => {
    scene.hidden = true;
    credits.hidden = false;
    document.body.classList.add("credits-active");
    credits.querySelector(".return-link").focus();
  }, 650);
});

// Observa quando o final dos créditos aparece na tela e redireciona para a página inicial

const creditsEnd = document.querySelector(".credits-the-end"); // .credits-the-end é o ultimo <p> do elemento de créditos

let creditsEndWasVisible = false;

const creditsObserver = new IntersectionObserver((entries) => {
  const entry = entries[0];

  if (entry.isIntersecting) {
    creditsEndWasVisible = true;
    return;
  }

  if (creditsEndWasVisible) {
    window.location.href = "../index.html";
  }
});

creditsObserver.observe(creditsEnd);

renderLine();
