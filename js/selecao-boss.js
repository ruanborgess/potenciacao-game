const phaseBosses = {
  vila: [
    {
      name: "GUARDIÃO DA VILA",
      image: "../assets/images/boss/bossVila1.png",
      health: "800 / 800",
      exp: "150 EXP",
      description: "O primeiro defensor do reino. Mostre que você domina as bases antes de seguir pela jornada.",
      level: "NÍVEL 4",
      difficulty: 1,
      expPercent: 58
    },
    {
      name: "MESTRE DAS BASES",
      image: "../assets/images/boss/bossVila2.png",
      health: "1.000 / 1.000",
      exp: "200 EXP",
      description: "Ele conhece cada número da vila e desafia aventureiros a escolher a base correta.",
      level: "NÍVEL 6",
      difficulty: 1,
      expPercent: 68
    },
    {
      name: "SENTINELA NUMÉRICA",
      image: "../assets/images/boss/bossVila3.png",
      health: "1.200 / 1.200",
      exp: "250 EXP",
      description: "A última barreira da vila. Vença suas potências para abrir caminho até a árvore.",
      level: "NÍVEL 8",
      difficulty: 2,
      expPercent: 78
    }
  ],

  arvore: [
    {
      name: "GUARDIÃO DAS POTENCIAS",
      image: "../assets/images/boss/bossArvore1.png",
      health: "1.200 / 1.200",
      exp: "250 EXP",
      description: "Protetor ancestral das raízes exponenciais. Suas perguntas testam sua base.",
      level: "NÍVEL 12",
      difficulty: 3,
      expPercent: 76
    },
    {
      name: "SENTINELA DOS EXPOENTES",
      image: "../assets/images/boss/bossArvore2.png",
      health: "1.600 / 1.600",
      exp: "350 EXP",
      description: "Uma sentinela de cristais que cresce a cada expoente dominado.",
      level: "NÍVEL 16",
      difficulty: 3,
      expPercent: 84
    },
    {
      name: "ENTIDADE EXPONENCIAL",
      image: "../assets/images/boss/bossArvore3.png",
      health: "2.000 / 2.000",
      exp: "500 EXP",
      description: "A energia final da árvore. Apenas quem domina as potências consegue vencê-la.",
      level: "NÍVEL 20",
      difficulty: 4,
      expPercent: 95
    }
  ],

  portao: [
    {
      name: "VIGIA DO PORTÃO",
      image: "../assets/images/boss/bossPortao1.png",
      health: "1.500 / 1.500",
      exp: "300 EXP",
      description: "O vigia só libera a passagem para quem reconhece o poder de cada expoente.",
      level: "NÍVEL 22",
      difficulty: 4,
      expPercent: 78
    },
    {
      name: "CAVALEIRO DAS POTÊNCIAS",
      image: "../assets/images/boss/bossPortao2.png",
      health: "1.800 / 1.800",
      exp: "400 EXP",
      description: "Sua marreta cresce com cada cálculo. Use estratégia para atravessar o portão.",
      level: "NÍVEL 26",
      difficulty: 4,
      expPercent: 88
    },
    {
      name: "GUARDIÃO DO POTENCIUS",
      image: "../assets/images/boss/bossPortao3.png",
      health: "2.200 / 2.200",
      exp: "550 EXP",
      description: "A força final diante do castelo. Apenas quem domina as potências passa por ele.",
      level: "NÍVEL 30",
      difficulty: 4,
      expPercent: 96
    }
  ],

  castelo: [
    {
      name: "SOMBRA POTENCIAL",
      image: "../assets/images/characters/cientista.png",
      health: "2.400 / 2.400",
      exp: "600 EXP",
      description: "Cientista, o resposável por criar todos os guardiões do reino, e espalhar a escuridão rapidamente.",
      level: "NÍVEL 34",
      difficulty: 4,
      expPercent: 86
    },
    {
      name: "O CIENTISTA",
      image: "../assets/images/characters/ninja.png",
      health: "2.800 / 2.800",
      exp: "750 EXP",
      description: "Ninja Sombrio, o guerreiro implacável responsável por enfrentar quem ousa desafiar seu Rei.",
      level: "NÍVEL 38",
      difficulty: 5,
      expPercent: 94
    },
    {
      name: "POTENCIUS",
      image: "../assets/images/characters/boss.png",
      health: "3.500 / 3.500",
      exp: "1.000 EXP",
      description: "Potencius, o Rei das Potências, que governa o reino com sua maldade e desafia todos que tentam derrotá-lo.",
      level: "NÍVEL 42",
      difficulty: 5,
      expPercent: 100
    }
  ]
};

const phaseTitles = {
  vila: "VILA DAS BASES",
  arvore: "ÁRVORE DOS EXPOENTES",
  portao: "PORTÃO DAS POTÊNCIAS",
  castelo: "CASTELO EXPONENCIAL"
};

const phaseBackgrounds = {
  vila: {
    image: "../assets/images/background/fundo_selecao_vila.png",
    position: "center 0%",
    size: "auto",
    repeat: "repeat",
  },
  arvore: {
    image: "../assets/images/background/fundo_selecao_arvore.png",
    position: "center 0%",
    size: "auto",
    repeat: "repeat"
  },
  portao: {
    image: "../assets/images/background/fundo_selecao_portao.png",
    position: "center 0%",
    size: "auto",
    repeat: "repeat"
  },
  castelo: {
    image: "../assets/images/background/fundo_selecao_castelo.png",
    position: "center 0%",
    size: "auto",
    repeat: "repeat"
  }
};

const phase = new URLSearchParams(window.location.search).get("fase");
const isSelectionPage = document.querySelector(".boss-selection");

if (isSelectionPage && phase && phaseBosses[phase] && (window.Progressao?.faseLiberada(phase) ?? true)) {
document.body.dataset.phase = phase;
const phaseBackground = phaseBackgrounds[phase];
document.body.style.setProperty(
  "--phase-background",
  `url("${phaseBackground.image}")`
);
document.body.style.backgroundPosition =
  `0% 0%, 0% 0%, ${phaseBackground.position}`;
document.body.style.backgroundSize =
  `auto, auto, ${phaseBackground.size}`;
document.body.style.backgroundRepeat =
  `repeat, repeat, ${phaseBackground.repeat}`;
const bosses = phaseBosses[phase];

const cards = [...document.querySelectorAll(".boss-card")];
let selectedBossIndex = 0;

const elements = {
  title: document.querySelector("#page-title"),
  name: document.querySelector("#boss-name"),
  health: document.querySelector("#boss-health"),
  exp: document.querySelector("#boss-exp"),
  description: document.querySelector("#boss-description"),
  image: document.querySelector("#boss-image"),
  expBar: document.querySelector(".exp-bar i"),
  fight: document.querySelector("#fight-button")
};

function stars(difficulty) {
  return "★".repeat(difficulty) + "☆".repeat(5 - difficulty);
}

function selectBoss(index) {
  if (!window.Progressao?.chefeLiberado(phase, index)) return;
  selectedBossIndex = index;
  const boss = bosses[index];
  
  cards.forEach((card, cardIndex) => {
    const cardBoss = bosses[cardIndex];
    const selected = cardIndex === index;
    const unlocked = window.Progressao?.chefeLiberado(phase, cardIndex) ?? true;
    const completed = window.Progressao?.chefeVencido(phase, cardIndex) ?? false;

    card.classList.toggle("is-selected", selected);
    card.setAttribute("aria-pressed", selected);
    card.disabled = !unlocked;
    card.classList.toggle("is-locked", !unlocked);
    card.classList.toggle("is-complete", completed);
    card.setAttribute("aria-label", unlocked
      ? `${cardBoss.name}${completed ? ", chefe derrotado" : ""}`
      : `${cardBoss.name}, chefe bloqueado`);

    card.querySelector(".boss-card-copy strong").textContent =
      cardBoss.name;

    card.querySelector(".boss-card-copy small").textContent =
      cardBoss.level;

    const cardStars = card.querySelector(".stars");

    cardStars.textContent = stars(cardBoss.difficulty);

    cardStars.setAttribute(
      "aria-label",
      `${cardBoss.difficulty} de 5 estrelas`
    );

    card.querySelector("em")?.remove();

    if (selected) {
      card.insertAdjacentHTML("beforeend", completed ? "<em>CONCLUÍDO</em>" : "<em>ATUAL</em>");
    }

    card.querySelector(".boss-card-copy").previousElementSibling.querySelector("img").src =
      cardBoss.image;
  });

  elements.title.textContent = phaseTitles[phase];
  elements.name.textContent = boss.name;
  elements.health.textContent = boss.health;
  elements.exp.textContent = boss.exp;
  elements.description.textContent = boss.description;
  elements.image.src = boss.image;
  elements.image.alt = boss.name;
  elements.expBar.style.width = `${boss.expPercent}%`;
}

cards.forEach((card, index) => {
  card.addEventListener("click", () => selectBoss(index));
});

elements.fight.addEventListener("click", () => {
  if (!(window.Progressao?.chefeLiberado(phase, selectedBossIndex) ?? true)) return;
  window.location.href = `batalha.html?fase=${encodeURIComponent(phase)}&chefe=${selectedBossIndex}`;
});

selectBoss(0);
} else if (isSelectionPage) {
  window.location.replace("mapa.html");
}
