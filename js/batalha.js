const battlePhaseSettings = {
  vila: { background: "../assets/images/campo_batalha.png" },
  arvore: { background: "../assets/images/campo_batalha.png" },
  portao: { background: "../assets/images/campo_batalha.png" },
  castelo: { background: "../assets/images/campo_batalha.png" }
};

const parameters = new URLSearchParams(window.location.search);
const battlePhase = parameters.get("fase");
const bossIndex = Number(parameters.get("chefe"));
const bosses = phaseBosses[battlePhase];
const boss = bosses?.[bossIndex];
const phaseSetting = battlePhaseSettings[battlePhase];

if (!boss || !phaseSetting) {
  window.location.replace("mapa.html");
} else {
  const battleScreen = document.querySelector(".battle-screen");
  const bossImage = document.querySelector("#boss-image");
  battleScreen.style.setProperty(
    "--battle-background", 
    `url("${phaseSetting.background}")`
  );
  document.querySelector("#phase-name").textContent = phaseTitles[battlePhase];
  document.querySelector("#battle-title").textContent = `BATALHA ${bossIndex + 1}`;
  document.querySelector("#boss-name").textContent = boss.name;
  bossImage.src = boss.image;
  bossImage.alt = boss.name;
    
  document.querySelector("#back-button").href = `${battlePhase}.html`;
}
