const parameters = new URLSearchParams(window.location.search);
const battlePhase = parameters.get("fase");
const bossIndex = Number(parameters.get("chefe"));
const boss = phaseBosses[battlePhase]?.[bossIndex];
const phaseSetting = battlePhaseSettings[battlePhase];

if (!boss || !phaseSetting) {
  window.location.replace("mapa.html");
} else {
  const initialBossHealth = Number(boss.health.replaceAll(".", "").split("/")[0].trim());
  const phaseNumber = phaseOrder.indexOf(battlePhase) + 1;
  const usedAttacksKey = `potenciacao-used-attacks-${battlePhase}`;
  const usedAttacks = new Set(JSON.parse(sessionStorage.getItem(usedAttacksKey) || "[]"));
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
  const screen = document.querySelector(".battle-screen");
  const ui = {
    bossHealth: document.querySelector("#boss-health-value"),
    bossBar: document.querySelector("#boss-health-bar"),
    playerHealth: document.querySelector("#player-health-value"),
    playerBar: document.querySelector("#player-health-bar"),
    energy: document.querySelector("#energy-value"),
    attacks: document.querySelector("#attack-list"),
    question: document.querySelector("#question-text"),
    message: document.querySelector("#battle-message"),
    turn: document.querySelector("#turn-label"),
    input: document.querySelector("#answer-input"),
    submit: document.querySelector("#answer-button"),
    bossTurn: document.querySelector("#boss-turn"),
    bossTurnLabel: document.querySelector("#boss-turn-label"),
    bossQuestion: document.querySelector("#boss-question-text"),
    bossAnswer: document.querySelector("#boss-answer-text")
  };

  screen.style.setProperty("--battle-background", `url("${phaseSetting.background}")`);
  document.querySelector("#phase-name").textContent = phaseTitles[battlePhase];
  document.querySelector("#battle-title").textContent = `DUELO ${bossIndex + 1}`;
  document.querySelector("#boss-name").textContent = boss.name;
  document.querySelector("#boss-status-name").textContent = boss.name;
  document.querySelector("#boss-level").textContent = boss.level;
  document.querySelector("#boss-image").src = boss.image;
  document.querySelector("#boss-image").alt = boss.name;
  document.querySelector("#back-button").href = `fase.html?fase=${encodeURIComponent(battlePhase)}`;

  function getRandomQuestion(questions, lastId) {
    const options = questions.filter((question) => question.id !== lastId);
    const pool = options.length ? options : questions;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function updateMeters() {
    ui.bossHealth.textContent = `${state.bossHealth.toLocaleString("pt-BR")} / ${initialBossHealth.toLocaleString("pt-BR")}`;
    ui.playerHealth.textContent = `${state.playerHealth} / 100`;
    ui.energy.textContent = `${state.energy} / 100`;
    ui.bossBar.style.width = `${Math.max(0, state.bossHealth / initialBossHealth * 100)}%`;
    ui.playerBar.style.width = `${state.playerHealth}%`;
  }

  function showNewQuestion() {
    const question = getRandomQuestion(getBattleQuestions(battlePhase), state.lastQuestionId);
    state.currentQuestion = question;
    state.lastQuestionId = question.id;
    state.attack = null;
    ui.question.innerHTML = question.text;
    ui.input.value = "";
    ui.input.disabled = false;
    ui.submit.disabled = false;
    ui.turn.textContent = "SUA VEZ · RESPONDA A POTÊNCIA";
    ui.message.textContent = `Ataque normal: ${phaseSetting.normalDamage} de dano. Ou escolha um especial.`;
    document.querySelectorAll(".attack-button").forEach((button) => button.classList.remove("selected"));
    ui.input.focus();
  }

  function useAttack(attack) {
    if (state.locked || usedAttacks.has(attack.id) || state.energy < attack.cost) return;

    state.attack = attack;
    state.energy -= attack.cost;
    usedAttacks.add(attack.id);
    sessionStorage.setItem(usedAttacksKey, JSON.stringify([...usedAttacks]));
    updateMeters();
    document.querySelectorAll(".attack-button").forEach((button) => {
      button.classList.toggle("selected", button.dataset.attack === attack.id);
    });
    const button = document.querySelector(`[data-attack="${attack.id}"]`);
    button.disabled = true;
    button.classList.add("is-used");
    button.querySelector("small").textContent = "USADO NESTA FASE";
    ui.message.textContent = `${attack.name} preparado: ${attack.cost} de energia consumida e ${attack.damage} de dano se acertar.`;
  }

  function renderAttacks() {
    battleAttacks.forEach((attack, index) => {
      const unlocked = index < phaseNumber - 1;
      const used = usedAttacks.has(attack.id);
      const button = document.createElement("button");

      button.type = "button";
      button.className = "attack-button";
      button.dataset.attack = attack.id;
      button.innerHTML = `<span>${attack.icon}</span><strong>${attack.name}</strong><small>${attack.cost} energia · ${attack.damage} dano</small>`;

      if (!unlocked) {
        button.disabled = true;
        button.classList.add("is-locked");
        button.querySelector("small").textContent = `DESBLOQUEIA NA FASE ${index + 2}`;
      }

      if (used) {
        button.disabled = true;
        button.classList.add("is-used");
        button.querySelector("small").textContent = "USADO NESTA FASE";
      }

      button.addEventListener("click", () => useAttack(attack));
      ui.attacks.append(button);
    });
  }

  function endBattle(won) {
    state.locked = true;
    ui.input.disabled = true;
    ui.submit.disabled = true;
    document.querySelectorAll(".attack-button").forEach((button) => { button.disabled = true; });
    ui.turn.textContent = won ? "VITÓRIA!" : "VOCÊ FOI DERROTADO";
    ui.message.textContent = won ? `Você derrotou ${boss.name}!` : "A energia se desfez. Tente novamente.";
    screen.classList.add(won ? "battle-won" : "battle-lost");
  }

  function wait(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  async function bossTurn() {
    const question = getRandomQuestion(getBossQuestions(battlePhase), state.lastBossQuestionId);
    const special = battlePhase !== "vila" && !state.bossSpecialUsed && state.bossHealth / initialBossHealth <= .3;
    const damage = special ? phaseSetting.bossDamage * 3 : phaseSetting.bossDamage + bossIndex;

    state.lastBossQuestionId = question.id;
    state.bossSpecialUsed ||= special;
    ui.bossTurn.hidden = false;
    ui.bossTurnLabel.textContent = special ? "ESPECIAL DO CHEFE · PODER FINAL" : "O CHEFE RESPONDE";
    ui.bossQuestion.innerHTML = `${boss.name}: ${question.text}`;
    ui.bossAnswer.textContent = "Calculando a potência...";
    await wait(3000);

    if (state.locked) return;

    ui.bossAnswer.innerHTML = `Resposta: <b>${question.answer}</b> · ${damage} de dano!`;
    state.playerHealth = Math.max(0, state.playerHealth - damage);
    updateMeters();
    await wait(900);
    ui.bossTurn.hidden = true;

    if (state.playerHealth === 0) return endBattle(false);
    showNewQuestion();
  }

  document.querySelector("#answer-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (state.locked || !state.currentQuestion) return;

    ui.input.disabled = true;
    ui.submit.disabled = true;
    const attack = state.attack;
    const correct = Number(ui.input.value) === state.currentQuestion.answer;

    if (correct) {
      const damage = attack ? attack.damage : phaseSetting.normalDamage;
      state.bossHealth = Math.max(0, state.bossHealth - damage);
      updateMeters();
      ui.message.textContent = "Resposta certa! Sua magia acertou o chefe.";
      if (state.bossHealth === 0) return endBattle(true);
    } else {
      ui.message.textContent = `Resposta incorreta. Era ${state.currentQuestion.answer}. O chefe contra-ataca!`;
    }

    await bossTurn();
  });

  renderAttacks();
  updateMeters();
  showNewQuestion();
}
