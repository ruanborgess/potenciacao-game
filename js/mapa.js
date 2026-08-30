const MAP_WIDTH = 1919;
const MAP_HEIGHT = 820;

const BACKGROUND_POSITION_X = 0.43;

/*
  Coordenadas das fases na imagem original.

  Essas coordenadas correspondem aos elementos
  que realmente aparecem no seu fundo_mapa.png.
*/

const phases = {
  vila: {
    x: 500,
    y: 450
  },

  arvore: {
    x: 780,
    y: 160
  },

  portao: {
    x: 1120,
    y: 400
  },

  castelo: {
    x: 1380,
    y: 30
  }
};

const characterOffsets = {
  vila: { x: 0, y: 100 },
  arvore: { x: 50, y: 180 },
  portao: { x: -100, y: 100 },
  castelo: { x: -50, y: 250 }
};


const character = document.getElementById("mapCharacter");

const storyStartButton = document.getElementById("story-start-button");

const storyCharacter = document.getElementById("story-character");
const storyStep = document.getElementById("story-step");
const storyTitle = document.getElementById("story-title");
const storyText = document.getElementById("story-text");

const phaseElements = document.querySelectorAll(".phase");


/*
  Última fase visitada.
  
  Se ainda não existe nenhuma,
  começamos na Vila.
*/

let currentPhase =
  localStorage.getItem("batalhaPotenciasFase") || "vila";

const showStory =
  sessionStorage.getItem("batalhaPotenciasMostrarHistoria") === "true";

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

let storyIndex = 0;

if (showStory) {
  document.body.classList.add("story-active");
  sessionStorage.removeItem("batalhaPotenciasMostrarHistoria");
}

/* =====================================================
   CALCULA A POSIÇÃO REAL DA IMAGEM
   ===================================================== */

function getMapPosition(x, y) {

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;


  /*
    O CSS usa background-size: cover.

    Portanto precisamos descobrir
    quanto a imagem foi ampliada.
  */

  const scale = Math.max(
    screenWidth / MAP_WIDTH,
    screenHeight / MAP_HEIGHT
  );


  const renderedWidth = MAP_WIDTH * scale;
  const renderedHeight = MAP_HEIGHT * scale;


  /*
    Mesmo cálculo do background-position: 43%.
  */

  const offsetX =
    (screenWidth - renderedWidth) *
    BACKGROUND_POSITION_X;

  const offsetY =
    (screenHeight - renderedHeight) *
    0.5;


  /*
    Transformamos a coordenada original
    da imagem em coordenada da tela.
  */

  return {
    left: (x * scale) + offsetX,
    top: (y * scale) + offsetY
  };
}


/* =====================================================
   POSICIONA TODAS AS FASES
   ===================================================== */

function positionPhases() {

  phaseElements.forEach((phaseElement) => {

    const phaseName =
      phaseElement.dataset.phase;

    const phase =
      phases[phaseName];

    if (!phase) {
      return;
    }


    const position =
      getMapPosition(
        phase.x,
        phase.y
      );


    phaseElement.style.left =
      `${position.left}px`;

    phaseElement.style.top =
      `${position.top}px`;
  });
}


/* =====================================================
   POSICIONA O PERSONAGEM
   ===================================================== */

function positionCharacter() {

  const phase =
    phases[currentPhase];

  const offset =
    characterOffsets[currentPhase] || { x: 0, y: 0 };

  if (!phase) {
    return;
  }


  const position =
    getMapPosition(
      phase.x + offset.x,
      phase.y + offset.y
    );


  character.style.left =
    `${position.left}px`;

  character.style.top =
    `${position.top}px`;
}


/* =====================================================
   MARCA A FASE ATUAL
   ===================================================== */

function updateCurrentPhase() {

  phaseElements.forEach((phaseElement) => {

    const phaseName =
      phaseElement.dataset.phase;

    phaseElement.classList.toggle(
      "current",
      phaseName === currentPhase
    );
  });
}


/* =====================================================
   CLIQUE NAS FASES
   ===================================================== */

phaseElements.forEach((phaseElement) => {

  phaseElement.addEventListener("click", () => {

    const selectedPhase =
      phaseElement.dataset.phase;


    /*
      Salva a última fase clicada.
    */

    localStorage.setItem(
      "batalhaPotenciasFase",
      selectedPhase
    );


    currentPhase =
      selectedPhase;

    /*
      O personagem muda para essa fase
      quando o usuário voltar ao mapa.
    */

    updateCurrentPhase();
    positionCharacter();
  });
});


/* =====================================================
   INICIALIZAÇÃO
   ===================================================== */

positionPhases();

positionCharacter();

updateCurrentPhase();


/* =====================================================
   FECHA A INTRODUÇÃO E LIBERA O MAPA
   ===================================================== */

function renderStoryScene() {
  const scene = storyScenes[storyIndex];
  const isLastScene = storyIndex === storyScenes.length - 1;

  storyCharacter.src = scene.image;
  storyCharacter.className = `story-character story-character--scene-${storyIndex + 1}`;
  storyStep.textContent = `História ${storyIndex + 1} de ${storyScenes.length}`;
  storyTitle.textContent = scene.title;
  storyText.textContent = scene.text;
  storyStartButton.textContent = isLastScene ? "Iniciar aventura" : "Próximo";
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
