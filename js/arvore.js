const bosses = [
  {
    name: "GUARDIÃO DAS RAÍZES",
    health: "1.200 / 1.200",
    exp: "250 EXP",
    description: "Protetor ancestral das raízes exponenciais. Suas perguntas testam sua base.",
    expPercent: 76
  },
  {
    name: "SENTINELA DOS EXPOENTES",
    health: "1.600 / 1.600",
    exp: "350 EXP",
    description: "Uma sentinela de cristais que cresce a cada expoente dominado.",
    expPercent: 84
  },
  {
    name: "ENTIDADE EXPONENCIAL",
    health: "2.000 / 2.000",
    exp: "500 EXP",
    description: "A energia final da árvore. Apenas quem domina as potências consegue vencê-la.",
    expPercent: 95
  }
];

const cards = [...document.querySelectorAll(".boss-card")];
const elements = {
  name: document.querySelector("#boss-name"),
  health: document.querySelector("#boss-health"),
  exp: document.querySelector("#boss-exp"),
  description: document.querySelector("#boss-description"),
  image: document.querySelector("#boss-image"),
  expBar: document.querySelector(".exp-bar i"),
  fight: document.querySelector("#fight-button")
};

function selectBoss(index) {
  const boss = bosses[index];

  cards.forEach((card, cardIndex) => {
    const selected = cardIndex === index;

    card.classList.toggle("is-selected", selected);
    card.setAttribute("aria-pressed", selected);
    card.querySelector("em")?.remove();

    if (selected) {
      card.insertAdjacentHTML("beforeend", "<em>ATUAL</em>");
    }
  });

  elements.name.textContent = boss.name;
  elements.health.textContent = boss.health;
  elements.exp.textContent = boss.exp;
  elements.description.textContent = boss.description;
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
