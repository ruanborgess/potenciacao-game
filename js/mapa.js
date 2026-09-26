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
    x: 1110,
    y: 400
  },

  castelo: {
    x: 1380,
    y: 15
  }
};

const characterOffsets = {
  vila: { x: 0, y: 100 },
  arvore: { x: 50, y: 180 },
  portao: { x: -100, y: 100 },
  castelo: { x: -75, y: 250 }
};


const character = document.getElementById("mapCharacter");



const phaseElements = document.querySelectorAll(".phase");


/*
  Última fase visitada.
  
  Se ainda não existe nenhuma,
  começamos na Vila.
*/

let currentPhase =
  localStorage.getItem("batalhaPotenciasFase") || "vila";



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

  const selectedPhase = phaseElement.dataset.phase;
  const unlocked = window.Progressao?.faseLiberada(selectedPhase) ?? true;
  const completed = window.Progressao?.faseConcluida(selectedPhase) ?? false;
  phaseElement.classList.toggle("is-locked", !unlocked);
  phaseElement.classList.toggle("is-complete", completed);
  phaseElement.setAttribute("aria-disabled", String(!unlocked));
  phaseElement.setAttribute("aria-label", !unlocked
    ? `Fase ${selectedPhase}, bloqueada`
    : `Fase ${selectedPhase}${completed ? ", concluída" : ""}`);

  phaseElement.addEventListener("click", (event) => {

    if (!(window.Progressao?.faseLiberada(selectedPhase) ?? true)) {
      event.preventDefault();
      return;
    }


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
