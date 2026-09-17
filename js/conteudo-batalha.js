/* Edite os ataques, perguntas e valores de cada fase neste arquivo. */

const phaseOrder = ["vila", "arvore", "portao", "castelo"];

const battleAttacks = [
  { id: "faisca", name: "FAÍSCA BASE", icon: "✦", cost: 50, damage: 650 },
  { id: "raio", name: "RAIO EXPOENTE", icon: "ϟ", cost: 70, damage: 950 },
  { id: "nova", name: "NOVA POTENTE", icon: "✹", cost: 90, damage: 1350 }
];

const battleQuestions = {
  vila: [[2, 3], [3, 2], [4, 2], [5, 2], [2, 4], [3, 3]],
  arvore: [[2, 5], [3, 3], [4, 3], [5, 3], [6, 2], [3, 4]],
  portao: [[2, 6], [3, 4], [4, 4], [5, 3], [6, 3], [7, 2]],
  castelo: [[2, 7], [3, 5], [4, 4], [5, 4], [6, 3], [7, 3]]
};

const bossQuestions = {
  vila: [[2, 3], [3, 2], [4, 2]],
  arvore: [[2, 5], [3, 3], [4, 3]],
  portao: [[2, 6], [3, 4], [4, 4]],
  castelo: [[2, 7], [3, 5], [5, 4]]
};

const battlePhaseSettings = {
  vila: { background: "../assets/images/campo_batalha.png", normalDamage: 260, bossDamage: 4 },
  arvore: { background: "../assets/images/campo_batalha.png", normalDamage: 340, bossDamage: 5 },
  portao: { background: "../assets/images/campo_batalha.png", normalDamage: 420, bossDamage: 6 },
  castelo: { background: "../assets/images/campo_batalha.png", normalDamage: 500, bossDamage: 7 }
};

function createPowerQuestion([base, exponent]) {
  return {
    id: `${base}-${exponent}`,
    text: `Quanto é <b>${base}<sup>${exponent}</sup></b>?`,
    answer: base ** exponent
  };
}

function getBattleQuestions(phase) {
  return (battleQuestions[phase] || battleQuestions.vila).map(createPowerQuestion);
}

function getBossQuestions(phase) {
  return (bossQuestions[phase] || bossQuestions.vila).map(createPowerQuestion);
}
