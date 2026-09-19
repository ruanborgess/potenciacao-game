// Parâmetros da batalha
const parameters = new URLSearchParams(window.location.search);
const battlePhase = parameters.get("fase");
const bossIndex = Number(parameters.get("chefe"));

// Dados da fase e do chefe
const boss = phaseBosses[battlePhase]?.[bossIndex];
const phaseSetting = battlePhaseSettings[battlePhase];

// Validação dos dados recebidos
if (!boss || !phaseSetting) {
  window.location.replace("mapa.html");
} else {
  // Configurações iniciais
  const initialBossHealth = Number(
    boss.health.replaceAll(".", "").split("/")[0].trim()
  );

  const phaseNumber = phaseOrder.indexOf(battlePhase) + 1;
  const usedAttacksKey = `potenciacao-used-attacks-${battlePhase}`;

  const usedAttacks = new Set(
    JSON.parse(sessionStorage.getItem(usedAttacksKey) || "[]")
  );

  // Estado atual da batalha
  const state = {
    bossHealth: initialBossHealth,
    playerHealth: 100,
    energy: 100,
    attack: null,
    currentQuestion: null,
    lastQuestionId: "",
    lastBossQuestionId: "",
    bossSpecialUsed: false,
    locked: false
  };

  // Elementos da interface
  const screen = document.querySelector(".battle-screen");

  const ui = {
    phaseName: document.querySelector("#phase-name"),
    battleTitle: document.querySelector("#battle-title"),
    backButton: document.querySelector("#back-button"),

    bossName: document.querySelector("#boss-name"),
    bossStatusName: document.querySelector("#boss-status-name"),
    bossLevel: document.querySelector("#boss-level"),
    bossImage: document.querySelector("#boss-image"),

    bossHealth: document.querySelector("#boss-health-value"),
    bossBar: document.querySelector("#boss-health-bar"),

    playerHealth: document.querySelector("#player-health-value"),
    playerBar: document.querySelector("#player-health-bar"),

    energy: document.querySelector("#energy-value"),
    energyBar: document.querySelector("#energy-bar"),

    attacks: document.querySelector("#attack-list"),

    question: document.querySelector("#question-text"),
    message: document.querySelector("#battle-message"),
    turn: document.querySelector("#turn-label"),

    form: document.querySelector("#answer-form"),
    input: document.querySelector("#answer-input"),
    submit: document.querySelector("#answer-button"),

    bossTurn: document.querySelector("#boss-turn"),
    bossTurnLabel: document.querySelector("#boss-turn-label"),
    bossQuestion: document.querySelector("#boss-question-text"),
    bossAnswer: document.querySelector("#boss-answer-text")
  };

  // Configuração visual da batalha
  screen.style.setProperty(
    "--battle-background",
    `url("${phaseSetting.background}")`
  );

  ui.phaseName.textContent = phaseTitles[battlePhase];
  ui.battleTitle.textContent = `DUELO ${bossIndex + 1}`;

  ui.bossName.textContent = boss.name;
  ui.bossStatusName.textContent = boss.name;
  ui.bossLevel.textContent = boss.level;

  ui.bossImage.src = boss.image;
  ui.bossImage.alt = boss.name;

  ui.backButton.href =
    `fase.html?fase=${encodeURIComponent(battlePhase)}`;


  // Escolhe uma pergunta diferente da anterior
  function getRandomQuestion(questions, lastId) {
    const options = questions.filter(
      (question) => question.id !== lastId
    );

    const pool = options.length ? options : questions;

    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Atualiza vida e energia na interface
  function updateMeters() {
    ui.bossHealth.textContent =
      `${state.bossHealth.toLocaleString("pt-BR")} / ${initialBossHealth.toLocaleString("pt-BR")}`;

    ui.playerHealth.textContent =
      `${state.playerHealth} / 100`;

    ui.energy.textContent =
      `${state.energy} / 100`;

    ui.bossBar.style.width =
      `${Math.max(
        0,
        (state.bossHealth / initialBossHealth) * 100
      )}%`;

    ui.playerBar.style.width =
      `${state.playerHealth}%`;

    ui.energyBar.style.width =
      `${state.energy}%`;
  }

  // Prepara uma nova pergunta para o jogador
  function showNewQuestion() {
    const question = getRandomQuestion(
      getBattleQuestions(battlePhase),
      state.lastQuestionId
    );

    state.currentQuestion = question;
    state.lastQuestionId = question.id;
    state.attack = null;

    ui.question.innerHTML = question.text;

    ui.input.value = "";
    ui.input.disabled = false;
    ui.submit.disabled = false;

    ui.turn.textContent =
      "SUA VEZ · RESPONDA A POTÊNCIA";

    ui.message.textContent =
      `Ataque normal: ${phaseSetting.normalDamage} de dano. Ou escolha um especial.`;

    document
      .querySelectorAll(".attack-button")
      .forEach((button) => {
        button.classList.remove("selected");
      });

    ui.input.focus();
  }

  // Seleciona um ataque especial
  function useAttack(attack) {
    if (
      state.locked ||
      usedAttacks.has(attack.id) ||
      state.energy < attack.cost
    ) {
      return;
    }

    state.attack = attack;
    state.energy -= attack.cost;

    usedAttacks.add(attack.id);

    sessionStorage.setItem(
      usedAttacksKey,
      JSON.stringify([...usedAttacks])
    );

    updateMeters();

    document
      .querySelectorAll(".attack-button")
      .forEach((button) => {
        button.classList.toggle(
          "selected",
          button.dataset.attack === attack.id
        );
      });

    const button = document.querySelector(
      `[data-attack="${attack.id}"]`
    );

    button.disabled = true;
    button.classList.add("is-used");

    button.querySelector("small").textContent =
      "USADO NESTA FASE";

    ui.message.textContent =
      `${attack.name} preparado: ${attack.cost} de energia consumida e ${attack.damage} de dano se acertar.`;
  }

  // Cria os botões de ataque
  function renderAttacks() {
    battleAttacks.forEach((attack, index) => {
      const unlocked = index < phaseNumber - 1;
      const used = usedAttacks.has(attack.id);

      const button = document.createElement("button");

      button.type = "button";
      button.className = "attack-button";
      button.dataset.attack = attack.id;

      button.innerHTML = `
        <span>${attack.icon}</span>
        <strong>${attack.name}</strong>
        <small>${attack.cost} energia · ${attack.damage} dano</small>
      `;

      if (!unlocked) {
        button.disabled = true;
        button.classList.add("is-locked");

        button.querySelector("small").textContent =
          `DESBLOQUEIA NA FASE ${index + 2}`;
      }

      if (used) {
        button.disabled = true;
        button.classList.add("is-used");

        button.querySelector("small").textContent =
          "USADO NESTA FASE";
      }

      button.addEventListener("click", () => {
        useAttack(attack);
      });

      ui.attacks.append(button);
    });
  }

  // Finaliza a batalha
  function endBattle(won) {
    state.locked = true;

    ui.input.disabled = true;
    ui.submit.disabled = true;

    document
      .querySelectorAll(".attack-button")
      .forEach((button) => {
        button.disabled = true;
      });

    ui.turn.textContent = won
      ? "VITÓRIA!"
      : "VOCÊ FOI DERROTADO";

    ui.message.textContent = won
      ? `Você derrotou ${boss.name}!`
      : "A energia se desfez. Tente novamente.";

    screen.classList.add(
      won ? "battle-won" : "battle-lost"
    );
  }

  // Cria uma pausa durante as ações
  function wait(milliseconds) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, milliseconds);
    });
  }

  // Executa o turno do chefe
  async function bossTurn() {
    const question = getRandomQuestion(
      getBossQuestions(battlePhase),
      state.lastBossQuestionId
    );

    const special =
      battlePhase !== "vila" &&
      !state.bossSpecialUsed &&
      state.bossHealth / initialBossHealth <= 0.3;

    const damage = special
      ? phaseSetting.bossDamage * 3
      : phaseSetting.bossDamage + bossIndex;

    state.lastBossQuestionId = question.id;
    state.bossSpecialUsed ||= special;

    ui.bossTurn.hidden = false;

    ui.bossTurnLabel.textContent = special
      ? "ESPECIAL DO CHEFE · PODER FINAL"
      : "O CHEFE RESPONDE";

    ui.bossQuestion.innerHTML =
      `${boss.name}: ${question.text}`;

    ui.bossAnswer.textContent =
      "Calculando a potência...";

    await wait(2000);

    if (state.locked) return;

    ui.bossAnswer.innerHTML =
      `Resposta: <b>${question.answer}</b> <br><br> Você sofreu ${damage} de dano!`;

    state.playerHealth = Math.max(
      0,
      state.playerHealth - damage
    );

    updateMeters();

    await wait(2000);

    ui.bossTurn.hidden = true;

    if (state.playerHealth === 0) {
      return endBattle(false);
    }

    showNewQuestion();
  }

  // Verifica a resposta do jogador
  ui.form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (
      state.locked ||
      !state.currentQuestion
    ) {
      return;
    }

    ui.input.disabled = true;
    ui.submit.disabled = true;

    const attack = state.attack;

    const correct =
      Number(ui.input.value) ===
      state.currentQuestion.answer;

    // Resposta correta
    if (correct) {
      const damage = attack
        ? attack.damage
        : phaseSetting.normalDamage;

      state.bossHealth = Math.max(
        0,
        state.bossHealth - damage
      );

      updateMeters();

      ui.message.textContent =
        "Resposta certa! Sua magia acertou o chefe.";

      if (state.bossHealth === 0) {
        return endBattle(true);
      }
    }

    // Resposta incorreta
    else {
      ui.message.textContent =
        `Resposta incorreta. Era ${state.currentQuestion.answer}. O chefe contra-ataca!`;
    }

    await bossTurn();
  });

  // Inicializa a batalha
  renderAttacks();
  updateMeters();
  showNewQuestion();
}