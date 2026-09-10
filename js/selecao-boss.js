const phaseBosses = {
  vila: [
    {
      name: "GUARDIÃO DA VILA",
      image: "../assets/images/boss1_arvore.png",
      health: "800 / 800",
      exp: "150 EXP",
      description: "O primeiro defensor do reino. Mostre que você domina as bases antes de seguir pela jornada.",
      level: "NÍVEL 4",
      difficulty: 2,
      expPercent: 58
    },
    {
      name: "MESTRE DAS BASES",
      image: "../assets/images/boss1_arvore.png",
      health: "1.000 / 1.000",
      exp: "200 EXP",
      description: "Ele conhece cada número da vila e desafia aventureiros a escolher a base correta.",
      level: "NÍVEL 6",
      difficulty: 3,
      expPercent: 68
    },
    {
      name: "SENTINELA NUMÉRICA",
      image: "../assets/images/boss1_arvore.png",
      health: "1.200 / 1.200",
      exp: "250 EXP",
      description: "A última barreira da vila. Vença suas potências para abrir caminho até a árvore.",
      level: "NÍVEL 8",
      difficulty: 4,
      expPercent: 78
    }
  ],

  arvore: [
    {
      name: "GUARDIÃO DAS POTENCIAS",
      image: "../assets/images/boss1_arvore.png",
      health: "1.200 / 1.200",
      exp: "250 EXP",
      description: "Protetor ancestral das raízes exponenciais. Suas perguntas testam sua base.",
      level: "NÍVEL 12",
      difficulty: 3,
      expPercent: 76
    },
    {
      name: "SENTINELA DOS EXPOENTES",
      image: "../assets/images/boss1_arvore.png",
      health: "1.600 / 1.600",
      exp: "350 EXP",
      description: "Uma sentinela de cristais que cresce a cada expoente dominado.",
      level: "NÍVEL 16",
      difficulty: 4,
      expPercent: 84
    },
    {
      name: "ENTIDADE EXPONENCIAL",
      image: "../assets/images/boss1_arvore.png",
      health: "2.000 / 2.000",
      exp: "500 EXP",
      description: "A energia final da árvore. Apenas quem domina as potências consegue vencê-la.",
      level: "NÍVEL 20",
      difficulty: 5,
      expPercent: 95
    }
  ],

  portao: [
    {
      name: "VIGIA DO PORTÃO",
      image: "../assets/images/boss1_arvore.png",
      health: "1.500 / 1.500",
      exp: "300 EXP",
      description: "O vigia só libera a passagem para quem reconhece o poder de cada expoente.",
      level: "NÍVEL 22",
      difficulty: 3,
      expPercent: 78
    },
    {
      name: "CAVALEIRO DAS POTÊNCIAS",
      image: "../assets/images/boss1_arvore.png",
      health: "1.800 / 1.800",
      exp: "400 EXP",
      description: "Seu escudo cresce com cada cálculo. Use estratégia para atravessar o portão.",
      level: "NÍVEL 26",
      difficulty: 4,
      expPercent: 88
    },
    {
      name: "GUARDIÃO DO POTENCIUS",
      image: "../assets/images/boss1_arvore.png",
      health: "2.200 / 2.200",
      exp: "550 EXP",
      description: "A força final diante do castelo. Apenas quem domina as potências passa por ele.",
      level: "NÍVEL 30",
      difficulty: 5,
      expPercent: 96
    }
  ],

  castelo: [
    {
      name: "SOMBRA POTENCIAL",
      image: "../assets/images/boss1_arvore.png",
      health: "2.400 / 2.400",
      exp: "600 EXP",
      description: "Uma sombra criada pela energia roubada do reino. Enfrente-a no coração do castelo.",
      level: "NÍVEL 34",
      difficulty: 4,
      expPercent: 86
    },
    {
      name: "MAGISTA DAS POTÊNCIAS",
      image: "../assets/images/boss1_arvore.png",
      health: "2.800 / 2.800",
      exp: "750 EXP",
      description: "O magista manipula bases e expoentes para proteger a torre mais alta.",
      level: "NÍVEL 38",
      difficulty: 5,
      expPercent: 94
    },
    {
      name: "POTENCIUS",
      image: "../assets/images/boss1_arvore.png",
      health: "3.500 / 3.500",
      exp: "1.000 EXP",
      description: "O senhor do Castelo Exponencial. Derrote-o para devolver a luz ao Reino Exponencial.",
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

const phase = document.body.dataset.phase;
const bosses = phaseBosses[phase];

const cards = [...document.querySelectorAll(".boss-card")];

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

function stars(amount) {
  return "★".repeat(amount) + "☆".repeat(5 - amount);
}

function selectBoss(index) {
  const boss = bosses[index];
  
  cards.forEach((card, cardIndex) => {
    const cardBoss = bosses[cardIndex];
    const selected = cardIndex === index;

    card.classList.toggle("is-selected", selected);
    card.setAttribute("aria-pressed", selected);

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
      card.insertAdjacentHTML("beforeend", "<em>ATUAL</em>");
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
  elements.fight.textContent = "✦ DESAFIO EM BREVE ✦";
});

selectBoss(0);