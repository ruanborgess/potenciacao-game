// ==================================================
// CONFIGURAÇÃO DA BATALHA
// ==================================================

const parameters = new URLSearchParams(window.location.search);
const battlePhase = parameters.get("fase");
const bossIndex = Number(parameters.get("chefe"));

const boss = phaseBosses[battlePhase]?.[bossIndex];
const phaseSetting = battlePhaseSettings[battlePhase];

// ==================================================
// VALIDAÇÃO
// ==================================================

const bossLiberado =
  window.Progressao?.chefeLiberado(battlePhase, bossIndex) ?? true;

if (!boss || !phaseSetting || !bossLiberado) {
  window.location.replace("mapa.html");
} else {

  // ==================================================
  // DADOS INICIAIS
  // ==================================================

  const initialBossHealth = Number(
    boss.health.replaceAll(".", "").split("/")[0].trim()
  );

  const phaseNumber = phaseOrder.indexOf(battlePhase) + 1;

  const usedAttacks = new Set();

  // ==================================================
  // ESTADO DA BATALHA
  // ==================================================

  const state = {
    bossHealth: initialBossHealth,
    playerHealth: 100,
    energy: 100,

    attack: null,
    currentQuestion: null,

    lastQuestionId: "",
    lastBossQuestionId: "",

    bossSpecialUsed: false,
    locked: false,

    correct: 0,
    wrong: 0,
    rounds: 0,
    specials: 0,
  };

  // ==================================================
  // ELEMENTOS DA INTERFACE
  // ==================================================

  const screen = document.querySelector(".battle-screen");

  const ui = {
    // Chefe
    bossHealth: document.querySelector("#boss-health-value"),
    bossBar: document.querySelector("#boss-health-bar"),

    // Jogador
    playerHealth: document.querySelector("#player-health-value"),
    playerBar: document.querySelector("#player-health-bar"),

    // Energia
    energy: document.querySelector("#energy-value"),
    energyBar: document.querySelector("#energy-bar"),

    // Ataques
    attacks: document.querySelector("#attack-list"),

    // Pergunta
    question: document.querySelector("#question-text"),
    message: document.querySelector("#battle-message"),
    turn: document.querySelector("#turn-label"),

    // Resposta
    input: document.querySelector("#answer-input"),
    submit: document.querySelector("#answer-button"),

    // Turno do chefe
    bossTurn: document.querySelector("#boss-turn"),
    bossTurnLabel: document.querySelector("#boss-turn-label"),
    bossQuestion: document.querySelector("#boss-question-text"),
    bossAnswer: document.querySelector("#boss-answer-text"),

    // Resultado
    result: document.querySelector("#battle-result"),
    resultKicker: document.querySelector("#result-kicker"),
    resultTitle: document.querySelector("#result-title"),
    resultDescription: document.querySelector("#result-description"),
    resultCorrect: document.querySelector("#result-correct"),
    resultWrong: document.querySelector("#result-wrong"),
    resultRounds: document.querySelector("#result-rounds"),
    resultHealth: document.querySelector("#result-health"),
    resultEnergy: document.querySelector("#result-energy"),
    resultSpecials: document.querySelector("#result-specials"),
    retry: document.querySelector("#result-retry"),
    resultBack: document.querySelector("#result-back"),
  };

  // ==================================================
  // CONFIGURAÇÃO VISUAL
  // ==================================================

  screen.style.setProperty(
    "--battle-background",
    `url("${phaseSetting.background}")`
  );

  document.querySelector("#phase-name").textContent =
    phaseTitles[battlePhase];

  document.querySelector("#battle-title").textContent =
    `DUELO ${bossIndex + 1}`;

  document.querySelector("#boss-name").textContent = boss.name;

  document.querySelector("#boss-status-name").textContent =
    boss.name;

  document.querySelector("#boss-level").textContent =
    boss.level;

  document.querySelector("#boss-image").src =
    boss.image;

  document.querySelector("#boss-image").alt =
    boss.name;

  const backUrl =
    `fase.html?fase=${encodeURIComponent(battlePhase)}`;

  document.querySelector("#back-button").href = backUrl;
  ui.resultBack.href = backUrl;

  // ==================================================
  // PERGUNTAS
  // ==================================================

  function getRandomQuestion(questions, lastId) {
    const options = questions.filter(
      (question) => question.id !== lastId
    );

    const pool = options.length ? options : questions;

    return pool[
      Math.floor(Math.random() * pool.length)
    ];
  }

  // ==================================================
  // VIDA E ENERGIA
  // ==================================================

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

  // ==================================================
  // ATAQUES
  // ==================================================

  function updateAttackButtons() {
    document
      .querySelectorAll(".attack-button")
      .forEach((button) => {
        button.classList.toggle(
          "selected",
          state.attack?.id === button.dataset.attack
        );
      });
  }

  function selectAttack(attack) {
    if (
      state.locked ||
      usedAttacks.has(attack.id) ||
      state.energy < attack.cost
    ) {
      return;
    }

    state.attack =
      state.attack?.id === attack.id
        ? null
        : attack;

    updateAttackButtons();

    ui.message.textContent = state.attack
      ? `${attack.name} preparado. A energia só será usada ao lançar.`
      : "Ataque especial removido. Você usará o ataque normal.";
  }

  function consumeSelectedAttack() {
    const attack = state.attack;

    if (!attack) {
      return null;
    }

    state.energy -= attack.cost;
    state.specials += 1;

    usedAttacks.add(attack.id);

    const button = document.querySelector(
      `[data-attack="${attack.id}"]`
    );

    button.disabled = true;
    button.classList.add("is-used");

    button.querySelector("small").textContent =
      "USADO NESTA BATALHA";

    state.attack = null;

    updateMeters();

    return attack;
  }

  function renderAttacks() {
    battleAttacks.forEach((attack, index) => {
      const button = document.createElement("button");

      const unlocked = index < phaseNumber - 1;

      button.type = "button";
      button.className = "attack-button";
      button.dataset.attack = attack.id;

      button.innerHTML = `
        <span>${attack.icon}</span>
        <strong>${attack.name}</strong>
        <small>
          ${attack.cost} energia · ${attack.damage} dano
        </small>
      `;

      if (!unlocked) {
        button.disabled = true;
        button.classList.add("is-locked");

        button.querySelector("small").textContent =
          `DESBLOQUEIA NA FASE ${index + 2}`;
      }

      button.addEventListener(
        "click",
        () => selectAttack(attack)
      );

      ui.attacks.append(button);
    });
  }

  // ==================================================
  // NOVA PERGUNTA
  // ==================================================

  function showNewQuestion() {
    const question = getRandomQuestion(
      getBattleQuestions(battlePhase),
      state.lastQuestionId
    );

    state.currentQuestion = question;
    state.lastQuestionId = question.id;
    state.attack = null;

    updateAttackButtons();

    ui.question.innerHTML = question.text;

    ui.input.value = "";
    ui.input.disabled = false;
    ui.submit.disabled = false;

    ui.turn.textContent =
      "SUA VEZ · RESPONDA A POTÊNCIA";

    ui.message.textContent =
      `Ataque normal: ${phaseSetting.normalDamage} de dano. Ou escolha um especial.`;

    ui.input.focus();
  }

  // ==================================================
  // FINAL DA BATALHA
  // ==================================================

  function endBattle(won) {
    state.locked = true;

    ui.input.disabled = true;
    ui.submit.disabled = true;

    document
      .querySelectorAll(".attack-button")
      .forEach((button) => {
        button.disabled = true;
      });

    screen.classList.add(
      won ? "battle-won" : "battle-lost"
    );

    if (won) {
      window.Progressao?.registrarVitoria(
        battlePhase,
        bossIndex
      );
    }

    ui.resultKicker.textContent =
      won ? "CHEFE DERROTADO" : "A BATALHA TERMINOU";

    ui.resultTitle.textContent =
      won ? "VITÓRIA!" : "DERROTA";

    ui.resultDescription.textContent = won
      ? `Você derrotou ${boss.name} e abriu caminho na jornada.`
      : `${boss.name} venceu desta vez. Revise as potências e tente novamente.`;

    ui.resultCorrect.textContent = state.correct;
    ui.resultWrong.textContent = state.wrong;
    ui.resultRounds.textContent = state.rounds;

    ui.resultHealth.textContent =
      `${state.playerHealth} / 100`;

    ui.resultEnergy.textContent =
      `${state.energy} / 100`;

    ui.resultSpecials.textContent =
      state.specials;

    ui.retry.hidden = won;
    ui.result.hidden = false;
  }

  // ==================================================
  // TURNO DO CHEFE
  // ==================================================

  const wait = (milliseconds) =>
    new Promise((resolve) => {
      window.setTimeout(resolve, milliseconds);
    });


  async function bossTurn() {
    const question = getRandomQuestion(
      getBossQuestions(battlePhase),
      state.lastBossQuestionId
    );

    const special =
      !state.bossSpecialUsed &&
      state.bossHealth / initialBossHealth <= 0.1;

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

    if (state.locked) {
      return;
    }

    ui.bossAnswer.innerHTML =
      `Resposta: <b>${question.answer}</b><br><br> Você sofreu ${damage} de dano!`;

    state.playerHealth =
      Math.max(0, state.playerHealth - damage);

    updateMeters();

    await wait(2000);

    ui.bossTurn.hidden = true;

    if (state.playerHealth === 0) {
      return endBattle(false);
    }

    showNewQuestion();
  }


  // ==================================================
  // RESPOSTA DO JOGADOR
  // ==================================================

  document
    .querySelector("#answer-form")
    .addEventListener("submit", async (event) => {

      event.preventDefault();

      if (
        state.locked ||
        !state.currentQuestion
      ) {
        return;
      }

      ui.input.disabled = true;
      ui.submit.disabled = true;

      const attack = consumeSelectedAttack();

      const correct =
        Number(ui.input.value) ===
        state.currentQuestion.answer;

      state.rounds += 1;

      if (correct) {
        state.correct += 1;

        const damage = attack
          ? attack.damage
          : phaseSetting.normalDamage;

        state.bossHealth =
          Math.max(0, state.bossHealth - damage);

        updateMeters();

        if (state.bossHealth === 0) {
          return endBattle(true);
        }
      } else {
        state.wrong += 1;
      }

      await bossTurn();
    });


  // ==================================================
  // BOTÃO DE TENTAR NOVAMENTE
  // ==================================================

  ui.retry.addEventListener(
    "click",
    () => window.location.reload()
  );


  // ==================================================
  // INICIALIZAÇÃO
  // ==================================================

  renderAttacks();
  updateMeters();
  showNewQuestion();
}